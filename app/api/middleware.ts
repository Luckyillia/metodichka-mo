// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Проверяем защищенные API routes
    if (request.nextUrl.pathname.startsWith('/api/users')) {
        const authHeader = request.headers.get('authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
        }

        const token = authHeader.substring(7)

        try {
            // Декодируем и проверяем токен
            const user = verifyAuthToken(token)

            if (!user) {
                return NextResponse.json({ error: 'Недействительный токен' }, { status: 401 })
            }

            // Для маршрутов управления пользователями требуются права root или admin
            if (request.nextUrl.pathname === '/api/users' &&
                (request.method === 'POST' || request.method === 'PATCH' || request.method === 'DELETE')) {
                if (user.role !== 'root' && user.role !== 'admin') {
                    return NextResponse.json({ error: 'Недостаточно прав' }, { status: 403 })
                }
            }

            // Добавляем информацию о пользователе в заголовки для использования в API routes
            const headers = new Headers(request.headers)
            headers.set('x-user-id', user.id)
            headers.set('x-user-role', user.role)
            headers.set('x-user-username', user.username)

            return NextResponse.next({
                request: {
                    headers
                }
            })
        } catch (error) {
            return NextResponse.json({ error: 'Ошибка аутентификации' }, { status: 401 })
        }
    }

    return NextResponse.next()
}

function verifyAuthToken(token: string): any {
    try {
        // В реальном приложении используйте JWT или другую систему токенов
        // Здесь упрощенная проверка для примера
        const decoded = JSON.parse(Buffer.from(token, 'base64').toString())

        // Проверяем срок действия токена (24 часа)
        if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
            return null
        }

        return decoded
    } catch {
        return null
    }
}

export const config = {
    matcher: ['/api/users/:path*', '/api/auth/:path*']
}