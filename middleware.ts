import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import CryptoJS from 'crypto-js'
import { ENCRYPTION_KEY, SESSION_DURATION } from './lib/auth/constants'

function verifyAuthToken(token: string): any {
    try {
        const decodedStr = Buffer.from(token, 'base64').toString()
        const decoded = JSON.parse(decodedStr)

        const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
        if (Date.now() - loginTimestamp > SESSION_DURATION) {
            console.log('[Middleware] Token expired')
            return null
        }

        const signatureData = `${decoded.id}:${decoded.username}:${decoded.role}:${decoded.game_nick}`
        const expectedSignature = CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()

        if (decoded.signature !== expectedSignature) {
            console.log('[Middleware] Invalid signature')
            return null
        }

        console.log('[Middleware] Token verified successfully for user:', decoded.username)
        return decoded
    } catch (error) {
        console.error('[Middleware] Token verification error:', error)
        return null
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    console.log('[Middleware] Processing request:', request.method, path)

    // Allow public GET for parking spaces
    if (path === '/api/parking-spaces' && request.method === 'GET') {
        console.log('[Middleware] Allowing public GET for parking spaces')
        return NextResponse.next()
    }

    // Защищаем все API маршруты кроме login и action-logs-internal
    if (path.startsWith('/api/') && !path.startsWith('/api/auth/login') && !path.includes('/api/action-logs-internal')) {
        const authHeader = request.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[Middleware] No authorization header for path:', path)
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const user = verifyAuthToken(token)

        if (!user) {
            console.log('[Middleware] Invalid token for path:', path)
            return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
        }

        // Проверяем права для управления пользователями
        if (path.startsWith('/api/users')) {
            if (user.role !== 'root' && user.role !== 'admin') {
                console.log('[Middleware] Insufficient permissions for users API')

                try {
                    const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
                    const user_agent = request.headers.get("user-agent")

                    await fetch(`${request.nextUrl.origin}/api/action-logs-internal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: user.id,
                            game_nick: user.game_nick,
                            action: `Попытка доступа к API управления пользователями`,
                            action_type: 'other',
                            target_type: 'system',
                            details: `Отказано в доступе к ${path} (роль: ${user.role})`,
                            metadata: { path, method: request.method, role: user.role, reason: 'insufficient_permissions' },
                            ip_address,
                            user_agent,
                        })
                    })
                } catch (logError) {
                    console.error('[Middleware] Failed to log access denied:', logError)
                }

                return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
            }

            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
                if (user.role !== 'root' && user.role !== 'admin') {
                    try {
                        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
                        const user_agent = request.headers.get("user-agent")

                        await fetch(`${request.nextUrl.origin}/api/action-logs-internal`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                user_id: user.id,
                                game_nick: user.game_nick,
                                action: `Попытка ${request.method} операции без прав`,
                                action_type: 'other',
                                target_type: 'system',
                                details: `Отказано в ${request.method} запросе к ${path} (роль: ${user.role})`,
                                metadata: { path, method: request.method, role: user.role, reason: 'insufficient_permissions_for_operation' },
                                ip_address,
                                user_agent,
                            })
                        })
                    } catch (logError) {
                        console.error('[Middleware] Failed to log operation denied:', logError)
                    }

                    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
                }
            }
        }

        // Проверяем права для просмотра логов
        if (path.startsWith('/api/action-logs')) {
            if (user.role !== 'root' && user.role !== 'admin') {
                console.log('[Middleware] Insufficient permissions for action-logs API')

                try {
                    const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
                    const user_agent = request.headers.get("user-agent")

                    await fetch(`${request.nextUrl.origin}/api/action-logs-internal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: user.id,
                            game_nick: user.game_nick,
                            action: `Попытка доступа к журналу действий`,
                            action_type: 'other',
                            target_type: 'system',
                            details: `Отказано в доступе к логам (роль: ${user.role})`,
                            metadata: { path, method: request.method, role: user.role, reason: 'insufficient_permissions_logs' },
                            ip_address,
                            user_agent,
                        })
                    })
                } catch (logError) {
                    console.error('[Middleware] Failed to log logs access denied:', logError)
                }

                return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
            }
        }

        // Проверяем права для редактирования парковочных мест
        if (path === '/api/parking-spaces' && request.method === 'PUT') {
            console.log('[Middleware] Checking parking edit permissions for user:', user.game_nick, 'role:', user.role)

            // Только root, admin, ld и cc могут редактировать
            if (!['root', 'admin', 'ld', 'cc'].includes(user.role)) {
                console.log('[Middleware] Insufficient permissions for parking spaces edit')

                try {
                    const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
                    const user_agent = request.headers.get("user-agent")

                    await fetch(`${request.nextUrl.origin}/api/action-logs-internal`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_id: user.id,
                            game_nick: user.game_nick,
                            action: `Попытка редактирования парковочных мест`,
                            action_type: 'other',
                            target_type: 'system',
                            details: `Отказано в редактировании парковки (роль: ${user.role})`,
                            metadata: { path, method: request.method, role: user.role, reason: 'insufficient_permissions_parking' },
                            ip_address,
                            user_agent,
                        })
                    })
                } catch (logError) {
                    console.error('[Middleware] Failed to log parking edit denied:', logError)
                }

                return NextResponse.json({ error: 'Недостаточно прав для редактирования' }, { status: 403 })
            }

            console.log('[Middleware] User has parking edit permissions, allowing request')
        }

        // Добавляем информацию о пользователе в заголовки
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-user-id', user.id)
        requestHeaders.set('x-user-role', user.role)
        requestHeaders.set('x-user-username', user.username)
        requestHeaders.set('x-user-game-nick', user.game_nick)

        console.log('[Middleware] User authenticated:', user.username, 'Role:', user.role, 'Forwarding to:', path)

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            }
        })
    }

    return NextResponse.next()
}

// КРИТИЧЕСКИ ВАЖНО: Правильный matcher!
// Должен перехватывать ВСЕ методы для /api/parking-spaces
export const config = {
    matcher: [
        '/api/users/:path*',
        '/api/action-logs/:path*',
        '/api/parking-spaces',  // Это перехватит все методы: GET, PUT, POST, DELETE
    ]
}