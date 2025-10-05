// middleware.ts (в корне проекта, не в app/api!)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ENCRYPTION_KEY = process.env.MZ_ENCRYPTION_KEY || 'fallback-key-change-in-production'

async function verifyAuthToken(token: string): Promise<any> {
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

        // Проверяем подпись с Web Crypto API
        const encoder = new TextEncoder()
        const keyData = encoder.encode(ENCRYPTION_KEY)
        const signatureData = encoder.encode(`${decoded.id}:${decoded.username}:${decoded.role}:${decoded.game_nick}`)

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        )

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, signatureData)
        const expectedSignature = Array.from(new Uint8Array(signature))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')

        if (decoded.signature !== expectedSignature) {
            console.log('[Middleware] Invalid signature')
            return null
        }

        return decoded
    } catch (error) {
        console.error('[Middleware] Token verification error:', error)
        return null
    }
}

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Защищаем все API маршруты кроме login
    if (path.startsWith('/api/') && !path.startsWith('/api/login')) {
        const authHeader = request.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('[Middleware] No authorization header')
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
        }

        const token = authHeader.substring(7)
        const user = await verifyAuthToken(token)

        if (!user) {
            console.log('[Middleware] Invalid token')
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

        // Добавляем информацию о пользователе в заголовки
        const headers = new Headers(request.headers)
        headers.set('x-user-id', user.id)
        headers.set('x-user-role', user.role)
        headers.set('x-user-username', user.username)
        headers.set('x-user-game-nick', user.game_nick)

        console.log('[Middleware] User authenticated:', user.username, 'Role:', user.role)

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
    ]
}