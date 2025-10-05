import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import CryptoJS from "crypto-js"

const ENCRYPTION_KEY = process.env.MZ_ENCRYPTION_KEY || "fallback-key-change-in-production"

// Вспомогательная функция для получения данных пользователя из заголовков
function getUserFromToken(request: Request) {
    const authHeader = request.headers.get("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null
    }

    const token = authHeader.substring(7)

    try {
        const decoded = JSON.parse(Buffer.from(token, "base64").toString())

        const signatureData = `${decoded.id}:${decoded.username}:${decoded.role}:${decoded.game_nick}`
        const expectedSignature = CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()

        if (decoded.signature !== expectedSignature) {
            return null
        }

        const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000
        const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
        if (Date.now() - loginTimestamp > SESSION_DURATION) {
            return null
        }

        return {
            id: decoded.id,
            role: decoded.role,
            username: decoded.username,
            game_nick: decoded.game_nick,
        }
    } catch (error) {
        console.error("[Action Logs API] Error decoding token:", error)
        return null
    }
}

// GET - Получить логи действий
export async function GET(request: Request) {
    try {
        console.log("[Action Logs API] GET request received")
        console.log("[Action Logs API] Headers:", Object.fromEntries(request.headers.entries()))

        const currentUser = getUserFromToken(request)

        if (!currentUser) {
            console.log("[Action Logs API] No user found in token")
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        console.log("[Action Logs API] User found:", currentUser.game_nick, "Role:", currentUser.role)

        // Только admin и root могут просматривать логи
        if (currentUser.role !== "admin" && currentUser.role !== "root") {
            console.log("[Action Logs API] Insufficient permissions")
            return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 })
        }

        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get("limit") || "100")
        const offset = parseInt(searchParams.get("offset") || "0")
        const actionType = searchParams.get("action_type")
        const targetType = searchParams.get("target_type")
        const userId = searchParams.get("user_id")

        console.log("[Action Logs API] Fetching logs with params:", {
            limit,
            offset,
            actionType,
            targetType,
            userId,
        })

        let query = supabase
            .from("action_logs")
            .select("*", { count: "exact" })
            .order("created_at", { ascending: false })
            .range(offset, offset + limit - 1)

        // Применяем фильтры
        if (actionType) {
            query = query.eq("action_type", actionType)
        }
        if (targetType) {
            query = query.eq("target_type", targetType)
        }
        if (userId) {
            query = query.eq("user_id", userId)
        }

        const { data: logs, error, count } = await query

        if (error) {
            console.error("[Action Logs API] Supabase error:", error)
            return NextResponse.json({ error: "Не удалось получить логи" }, { status: 500 })
        }

        console.log("[Action Logs API] Fetched logs successfully, count:", logs?.length || 0, "total:", count)
        return NextResponse.json({ logs: logs || [], total: count || 0 })
    } catch (error) {
        console.error("[Action Logs API] Error fetching logs:", error)
        return NextResponse.json({ error: "Ошибка при получении логов" }, { status: 500 })
    }
}

// POST - Создать запись в логах
export async function POST(request: Request) {
    try {
        const currentUser = getUserFromToken(request)

        if (!currentUser) {
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        const body = await request.json()
        const { action, action_type, target_type, target_id, target_name, details, metadata } = body

        console.log("[Action Logs API] Creating log entry by:", currentUser.game_nick)

        if (!action || !action_type) {
            return NextResponse.json(
                { error: "Поля action и action_type обязательны" },
                { status: 400 }
            )
        }

        // Получаем IP и User-Agent из заголовков
        const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")
        const user_agent = request.headers.get("user-agent")

        const logEntry = {
            user_id: currentUser.id,
            game_nick: currentUser.game_nick,
            action,
            action_type,
            target_type,
            target_id,
            target_name,
            details,
            metadata,
            ip_address,
            user_agent,
        }

        const { data: newLog, error } = await supabase
            .from("action_logs")
            .insert([logEntry])
            .select()
            .single()

        if (error) {
            console.error("[Action Logs API] Supabase error:", error)
            return NextResponse.json(
                { error: "Не удалось создать запись в логе" },
                { status: 500 }
            )
        }

        console.log("[Action Logs API] Log entry created successfully")
        return NextResponse.json(newLog, { status: 201 })
    } catch (error) {
        console.error("[Action Logs API] Error creating log:", error)
        return NextResponse.json({ error: "Ошибка при создании записи в логе" }, { status: 500 })
    }
}