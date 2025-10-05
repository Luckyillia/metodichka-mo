// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import CryptoJS from 'crypto-js'
import { ENCRYPTION_KEY, SESSION_DURATION } from './lib/auth/constants'

function verifyAuthToken(token: string): any {
    try {
        const decodedStr = Buffer.from(token, 'base64').toString()
        const decoded = JSON.parse(decodedStr)

        // Проверяем срок действия (7 дней)
        const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000
        const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
        if (Date.now() - loginTimestamp > SESSION_DURATION) {
            console.log('[Middleware] Token expired')
            return null
        }

        // Проверяем подпись используя тот же метод что и в auth-service
        const signatureData = `${decoded.id}:${decoded.username}:${decoded.role}:${decoded.game_nick}`
        const expectedSignature = CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()

        if (decoded.signature !== expectedSignature) {
            console.log('[Middleware] Invalid signature')
            console.log('[Middleware] Expected:', expectedSignature)
            console.log('[Middleware] Got:', decoded.signature)
            return null
        }

        console.log('[Middleware] Token verified successfully for user:', decoded.username)
        return decoded
    } catch (error) {
        console.error('[Middleware] Token verification error:', error)
        return null
    }
}

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Защищаем все API маршруты кроме login
    if (path.startsWith('/api/') && !path.startsWith('/api/auth/login')) {
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
            // Только root и admin могут работать с пользователями
            if (user.role !== 'root' && user.role !== 'admin') {
                console.log('[Middleware] Insufficient permissions for users API')
                return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
            }

            // Для операций изменения/удаления проверяем дополнительно
            if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
                if (user.role !== 'root' && user.role !== 'admin') {
                    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
                }
            }
        }

        // Проверяем права для просмотра логов
        if (path.startsWith('/api/action-logs')) {
            // Только root и admin могут просматривать логи
            if (user.role !== 'root' && user.role !== 'admin') {
                console.log('[Middleware] Insufficient permissions for action-logs API')
                return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
            }
        }

        // Добавляем информацию о пользователе в заголовки
        const headers = new Headers(request.headers)
        headers.set('x-user-id', user.id)
        headers.set('x-user-role', user.role)
        headers.set('x-user-username', user.username)
        headers.set('x-user-game-nick', user.game_nick)

        console.log('[Middleware] User authenticated:', user.username, 'Role:', user.role, 'Path:', path)

        return NextResponse.next({
            request: {
                headers
            }
        })
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/api/users/:path*',
        '/api/action-logs',
        '/api/action-logs/:path*',
    ]
}