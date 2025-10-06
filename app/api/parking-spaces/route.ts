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
    try {
        console.log("[Parking Spaces API] PUT request received")
        const currentUser = getUserFromHeaders(request)
        console.log("[Parking Spaces API] Current user:", currentUser)

        if (!currentUser) {
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

        const body = await request.json()
        const { place, person, car, license } = body

        if (!place || place < 1 || place > 36) {
            return NextResponse.json(
                { error: "Некорректный номер места" },
                { status: 400 }
            )
        }

        // Валидация данных
        if (!person || !car || !license) {
            return NextResponse.json(
                { error: "Все поля должны быть заполнены" },
                { status: 400 }
            )
        }

        console.log("[Parking Spaces API] Updating place:", place, "by:", currentUser.game_nick)

        // Получаем старые данные для логирования
        const { data: oldData } = await supabase
            .from("parking_spaces")
            .select("*")
            .eq("place", place)
            .single()

        // Обновляем данные
        const { data: updatedSpace, error } = await supabase
            .from("parking_spaces")
            .update({
                person,
                car,
                license,
                updated_by: currentUser.game_nick,
            })
            .eq("place", place)
            .select()
            .single()

        if (error) {
            console.error("[Parking Spaces API] Update error:", error)
            return NextResponse.json(
                { error: "Не удалось обновить данные" },
                { status: 500 }
            )
        }

        // Логируем изменение роли
        try {
            await supabase.from("action_logs").insert([
                {
                    user_id: currentUser.id,
                    game_nick: currentUser.game_nick,
                    action: `Обновлено парковочное место №${place}`,
                    action_type: "update",
                    target_type: "other",
                    target_id: place.toString(),
                    target_name: `Парковочное место №${place}`,
                    details: `Изменено с: ${oldData?.person} (${oldData?.car}) на: ${person} (${car})`,
                    previous_state: {
                        oldPerson: oldData?.person,
                        oldCar: oldData?.car,
                    },
                    new_state: {
                        oldPerson: person,
                        oldCar: car,
                    },
                    metadata: {
                        old_data: oldData,
                        new_data: updatedSpace,
                    },
                },
            ])
        } catch (logError) {
            console.error("[Users API] Failed to log role change:", logError)
        }

        console.log("[Parking Spaces API] Successfully updated place:", place)
        return NextResponse.json(updatedSpace)
    } catch (error) {
        console.error("[Parking Spaces API] Error updating parking space:", error)
        return NextResponse.json(
            { error: "Ошибка при обновлении данных" },
            { status: 500 }
        )
    }
}