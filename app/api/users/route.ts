import { NextResponse } from "next/server"
import { supabase, validateGameNick } from "@/lib/supabase"
import bcrypt from "bcryptjs"

// Вспомогательная функция для получения данных пользователя из заголовков middleware
function getUserFromHeaders(request: Request) {
  const userId = request.headers.get("x-user-id")
  const role = request.headers.get("x-user-role")
  const username = request.headers.get("x-user-username")
  const gameNick = request.headers.get("x-user-game-nick")

  if (!userId || !role || !username || !gameNick) {
    console.log('[Users API] Missing user headers:', { userId, role, username, gameNick })
    return null
  }

  return {
    id: userId,
    role: role as "root" | "admin" | "cc" | "user",
    username: username,
    game_nick: gameNick,
  }
}

// GET - Fetch all users
export async function GET(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    console.log("[Users API] Fetching users, requested by:", currentUser.username)

    const { data: users, error } = await supabase
        .from("users")
        .select("id, username, game_nick, role, created_at")
        .order("created_at", { ascending: false })

    if (error) {
      console.error("[Users API] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    console.log("[Users API] Fetched users, count:", users?.length || 0)
    return NextResponse.json(users || [])
  } catch (error) {
    console.error("[Users API] Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { username, gameNick, password, role } = body

    console.log("[Users API] Creating user:", username, "by:", currentUser.username)

    // Validation
    if (!username || !gameNick || !password || !role) {
      return NextResponse.json({ error: "Все поля обязательны для заполнения" }, { status: 400 })
    }

    // Проверка прав на основе СЕРВЕРНОЙ роли
    if (currentUser.role === "admin" && (role === "admin" || role === "root")) {
      return NextResponse.json(
          {
            error: "Администраторы могут создавать только пользователей с ролями 'user' и 'cc'",
          },
          { status: 403 },
      )
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({ error: "Имя пользователя должно быть от 3 до 50 символов" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 })
    }

    const nickValidation = validateGameNick(gameNick)
    if (!nickValidation.valid) {
      return NextResponse.json({ error: nickValidation.error }, { status: 400 })
    }

    // Check username
    const { data: existingUsername } = await supabase.from("users").select("id").eq("username", username).single()

    if (existingUsername) {
      return NextResponse.json({ error: "Имя пользователя уже существует" }, { status: 400 })
    }

    // Check game nick
    const { data: existingGameNick } = await supabase.from("users").select("id").eq("game_nick", gameNick).single()

    if (existingGameNick) {
      return NextResponse.json({ error: "Игровой ник уже занят" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: newUser, error } = await supabase
        .from("users")
        .insert([
          {
            username,
            game_nick: gameNick,
            password: hashedPassword,
            role,
          },
        ])
        .select("id, username, game_nick, role, created_at")
        .single()

    if (error) {
      console.error("[Users API] Supabase error:", error)
      return NextResponse.json(
          {
            error: "Не удалось создать пользователя",
            details: error.message,
          },
          { status: 500 },
      )
    }

    console.log("[Users API] User created successfully:", username)

    // Логируем создание пользователя
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Создан новый пользователь: ${gameNick}`,
          action_type: "create",
          target_type: "user",
          target_id: newUser.id,
          target_name: gameNick,
          details: `Создан пользователь с логином "${username}" и ролью "${role}"`,
          metadata: {
            username,
            game_nick: gameNick,
            role,
            created_by: currentUser.game_nick,
          },
        },
      ])
    } catch (logError) {
      console.error("[Users API] Failed to log action:", logError)
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("[Users API] Error creating user:", error)
    return NextResponse.json({ error: "Ошибка при создании пользователя" }, { status: 500 })
  }
}

// PUT - Update user
export async function PUT(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, username, gameNick, password } = body

    console.log("[Users API] Updating user:", userId, "by:", currentUser.username)

    if (!userId || !username || !gameNick) {
      return NextResponse.json({ error: "ID, имя пользователя и игровой ник обязательны" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("role, username, game_nick")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Защита root пользователя
    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя редактировать root пользователя" }, { status: 403 })
    }

    // Admin не может редактировать других админов
    if (currentUser.role === "admin" && existingUser.role === "admin") {
      return NextResponse.json(
          {
            error: "Администраторы не могут редактировать других администраторов",
          },
          { status: 403 },
      )
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({ error: "Имя пользователя должно быть от 3 до 50 символов" }, { status: 400 })
    }

    const nickValidation = validateGameNick(gameNick)
    if (!nickValidation.valid) {
      return NextResponse.json({ error: nickValidation.error }, { status: 400 })
    }

    // Check username uniqueness
    if (username !== existingUser.username) {
      const { data: existingUsername } = await supabase
          .from("users")
          .select("id")
          .eq("username", username)
          .neq("id", userId)
          .single()

      if (existingUsername) {
        return NextResponse.json({ error: "Имя пользователя уже существует" }, { status: 400 })
      }
    }

    // Check game nick uniqueness
    if (gameNick !== existingUser.game_nick) {
      const { data: existingGameNick } = await supabase
          .from("users")
          .select("id")
          .eq("game_nick", gameNick)
          .neq("id", userId)
          .single()

      if (existingGameNick) {
        return NextResponse.json({ error: "Игровой ник уже занят" }, { status: 400 })
      }
    }

    const updateData: any = {
      username,
      game_nick: gameNick,
    }

    if (password && password.trim() !== "") {
      if (password.length < 6) {
        return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 })
      }
      updateData.password = await bcrypt.hash(password, 10)
    }

    const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select("id, username, game_nick, role, created_at")
        .single()

    if (updateError) {
      console.error("[Users API] Supabase error:", updateError)
      return NextResponse.json({ error: "Не удалось обновить пользователя" }, { status: 500 })
    }

    console.log("[Users API] User updated successfully")
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[Users API] Error updating user:", error)
    return NextResponse.json({ error: "Ошибка при обновлении пользователя" }, { status: 500 })
  }
}

// PATCH - Update user role
export async function PATCH(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role } = body

    console.log("[Users API] Updating user role:", userId, "to", role, "by:", currentUser.username)

    if (!userId || !role) {
      return NextResponse.json({ error: "ID пользователя и роль обязательны" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя изменить роль root пользователя" }, { status: 403 })
    }

    // Admin restrictions
    if (currentUser.role === "admin") {
      if (existingUser.role === "admin") {
        return NextResponse.json(
            {
              error: "Администраторы не могут изменять роль других администраторов",
            },
            { status: 403 },
        )
      }

      if (role === "admin" || role === "root") {
        return NextResponse.json(
            {
              error: "Администраторы могут назначать только роли 'user' и 'cc'",
            },
            { status: 403 },
        )
      }
    }

    const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ role })
        .eq("id", userId)
        .select("id, username, game_nick, role, created_at")
        .single()

    if (updateError) {
      console.error("[Users API] Supabase error:", updateError)
      return NextResponse.json({ error: "Не удалось обновить роль" }, { status: 500 })
    }

    console.log("[Users API] User role updated successfully")
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[Users API] Error updating user:", error)
    return NextResponse.json({ error: "Ошибка при обновлении роли" }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    const currentUser = getUserFromHeaders(request)

    if (!currentUser) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    console.log("[Users API] Deleting user:", userId, "by:", currentUser.username)

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
    }

    const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("id, role, username, game_nick")
        .eq("id", userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя удалить root пользователя" }, { status: 403 })
    }

    // Admin не может удалять других админов
    if (currentUser.role === "admin" && existingUser.role === "admin") {
      return NextResponse.json(
          {
            error: "Администраторы не могут удалять других администраторов",
          },
          { status: 403 },
      )
    }

    const { error: deleteError } = await supabase.from("users").delete().eq("id", userId)

    if (deleteError) {
      console.error("[Users API] Supabase error:", deleteError)
      return NextResponse.json({ error: "Не удалось удалить пользователя" }, { status: 500 })
    }

    console.log("[Users API] User deleted successfully")

    // Логируем удаление пользователя
    try {
      await supabase.from("action_logs").insert([
        {
          user_id: currentUser.id,
          game_nick: currentUser.game_nick,
          action: `Удален пользователь: ${existingUser.game_nick || "Unknown"}`,
          action_type: "delete",
          target_type: "user",
          target_id: userId,
          target_name: existingUser.game_nick,
          details: `Удален пользователь с логином "${existingUser.username}" и ролью "${existingUser.role}"`,
          metadata: {
            deleted_username: existingUser.username,
            deleted_game_nick: existingUser.game_nick,
            deleted_role: existingUser.role,
            deleted_by: currentUser.game_nick,
          },
        },
      ])
    } catch (logError) {
      console.error("[Users API] Failed to log action:", logError)
    }

    return NextResponse.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error("[Users API] Error deleting user:", error)
    return NextResponse.json({ error: "Ошибка при удалении пользователя" }, { status: 500 })
  }
}