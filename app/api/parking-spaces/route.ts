import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Вспомогательная функция для получения данных пользователя из заголовков
function getUserFromHeaders(request: Request) {
    const userId = request.headers.get("x-user-id")
    const role = request.headers.get("x-user-role")
    const username = request.headers.get("x-user-username")
    const gameNick = request.headers.get("x-user-game-nick")

    if (!userId || !role || !username || !gameNick) {
        return null
    }

    return {
        id: userId,
        role: role as "root" | "admin" | "ld" | "cc" | "user",
        username: username,
        game_nick: gameNick,
    }
}

// Проверка прав на редактирование (LD = cc, admin, root)
function canEditParkingSpaces(role: string): boolean {
    return ["root", "admin", "ld", "cc"].includes(role)
}

// GET - Получить все парковочные места
export async function GET(request: Request) {
    try {
        console.log("[Parking Spaces API] GET request received")

        const { data: spaces, error } = await supabase
            .from("parking_spaces")
            .select("*")
            .order("place", { ascending: true })

        if (error) {
            console.error("[Parking Spaces API] Supabase error:", error)
            return NextResponse.json(
                { error: "Не удалось получить данные о парковке" },
                { status: 500 }
            )
        }

        console.log("[Parking Spaces API] Fetched spaces:", spaces?.length || 0)
        return NextResponse.json({ spaces: spaces || [] })
    } catch (error) {
        console.error("[Parking Spaces API] Error:", error)
        return NextResponse.json(
            { error: "Ошибка при получении данных о парковке" },
            { status: 500 }
        )
    }
}

// PUT - Обновить парковочное место
export async function PUT(request: Request) {
    console.log("[Parking Spaces API] ====== PUT REQUEST STARTED ======")
    console.log("[Parking Spaces API] Method:", request.method)
    console.log("[Parking Spaces API] URL:", request.url)

    try {
        const currentUser = getUserFromHeaders(request)
        console.log("[Parking Spaces API] Current user:", currentUser?.game_nick, "Role:", currentUser?.role)

        if (!currentUser) {
            console.error("[Parking Spaces API] No user found in headers")
            return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
        }

        // Проверка прав доступа
        if (!canEditParkingSpaces(currentUser.role)) {
            console.log("[Parking Spaces API] Insufficient permissions for user:", currentUser.game_nick)
            return NextResponse.json(
                { error: "Недостаточно прав для редактирования" },
                { status: 403 }
            )
        }

        // Читаем body
        let body
        try {
            body = await request.json()
            console.log("[Parking Spaces API] Request body parsed:", body)
        } catch (parseError) {
            console.error("[Parking Spaces API] Failed to parse request body:", parseError)
            return NextResponse.json(
                { error: "Неверный формат данных" },
                { status: 400 }
            )
        }

        const { place, person, car, license } = body

        // Валидация номера места
        if (!place || typeof place !== 'number' || place < 1 || place > 36) {
            console.error("[Parking Spaces API] Invalid place number:", place)
            return NextResponse.json(
                { error: "Некорректный номер места (должно быть от 1 до 36)" },
                { status: 400 }
            )
        }

        // Валидация данных
        if (!person || !car || !license) {
            console.error("[Parking Spaces API] Missing required fields")
            return NextResponse.json(
                { error: "Все поля должны быть заполнены" },
                { status: 400 }
            )
        }

        // Проверяем типы данных
        if (typeof person !== 'string' || typeof car !== 'string' || typeof license !== 'string') {
            console.error("[Parking Spaces API] Invalid field types")
            return NextResponse.json(
                { error: "Неверный формат данных полей" },
                { status: 400 }
            )
        }

        console.log("[Parking Spaces API] Updating place:", place, "by:", currentUser.game_nick)

        // Получаем старые данные для логирования
        const { data: oldData, error: fetchError } = await supabase
            .from("parking_spaces")
            .select("*")
            .eq("place", place)
            .single()

        if (fetchError) {
            console.error("[Parking Spaces API] Failed to fetch old data:", fetchError)
        }

        // Обновляем данные
        const { data: updatedSpace, error: updateError } = await supabase
            .from("parking_spaces")
            .update({
                person: person.trim(),
                car: car.trim(),
                license: license.trim(),
                updated_by: currentUser.game_nick,
                updated_at: new Date().toISOString(),
            })
            .eq("place", place)
            .select()
            .single()

        if (updateError) {
            console.error("[Parking Spaces API] Update error:", updateError)
            return NextResponse.json(
                { error: "Не удалось обновить данные: " + updateError.message },
                { status: 500 }
            )
        }

        if (!updatedSpace) {
            console.error("[Parking Spaces API] No data returned after update")
            return NextResponse.json(
                { error: "Не удалось получить обновленные данные" },
                { status: 500 }
            )
        }

        // Логируем изменение
        try {
            const logEntry = {
                user_id: currentUser.id,
                game_nick: currentUser.game_nick,
                action: `Обновлено парковочное место №${place}`,
                action_type: "update" as const,
                target_type: "other" as const,
                target_id: place.toString(),
                target_name: `Парковочное место №${place}`,
                details: oldData
                    ? `Изменено с: ${oldData.person} (${oldData.car}) на: ${person} (${car})`
                    : `Установлено: ${person} (${car})`,
                metadata: {
                    old_person: oldData?.person || null,
                    old_car: oldData?.car || null,
                    old_license: oldData?.license || null,
                    new_person: person,
                    new_car: car,
                    new_license: license,
                },
                ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
                user_agent: request.headers.get("user-agent"),
            }

            const { error: logError } = await supabase
                .from("action_logs")
                .insert([logEntry])

            if (logError) {
                console.error("[Parking Spaces API] Failed to log action:", logError)
            }
        } catch (logError) {
            console.error("[Parking Spaces API] Exception while logging:", logError)
        }

        console.log("[Parking Spaces API] Successfully updated place:", place)
        return NextResponse.json(updatedSpace, { status: 200 })
    } catch (error) {
        console.error("[Parking Spaces API] Unexpected error:", error)
        return NextResponse.json(
            { error: "Ошибка при обновлении данных" },
            { status: 500 }
        )
    }
}