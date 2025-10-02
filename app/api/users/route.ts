import { NextResponse } from "next/server"
import { supabase, validateGameNick } from "@/lib/supabase"
import bcrypt from "bcryptjs"

// GET - Fetch all users
export async function GET() {
  try {
    console.log("[v0] Users API: Fetching users from Supabase")

    const { data: users, error } = await supabase
        .from('users')
        .select('id, username, game_nick, role, created_at')
        .order('created_at', { ascending: false })

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    console.log("[v0] Users API: Fetched users, count:", users?.length || 0)
    return NextResponse.json(users || [])
  } catch (error) {
    console.error("[v0] Users API: Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST - Create new user
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, gameNick, password, role } = body

    console.log("[v0] Users API: Creating user:", username, "with game nick:", gameNick)

    // Validation
    if (!username || !gameNick || !password || !role) {
      return NextResponse.json({ error: "Все поля обязательны для заполнения" }, { status: 400 })
    }

    if (username.length < 3 || username.length > 50) {
      return NextResponse.json({ error: "Имя пользователя должно быть от 3 до 50 символов" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Пароль должен содержать минимум 6 символов" }, { status: 400 })
    }

    // Validate game nick format
    const nickValidation = validateGameNick(gameNick)
    if (!nickValidation.valid) {
      return NextResponse.json({ error: nickValidation.error }, { status: 400 })
    }

    // Check if username already exists
    const { data: existingUsername } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single()

    if (existingUsername) {
      return NextResponse.json({ error: "Имя пользователя уже существует" }, { status: 400 })
    }

    // Check if game nick already exists
    const { data: existingGameNick } = await supabase
        .from('users')
        .select('id')
        .eq('game_nick', gameNick)
        .single()

    if (existingGameNick) {
      return NextResponse.json({ error: "Игровой ник уже занят" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user in Supabase
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([
          {
            username,
            game_nick: gameNick,
            password: hashedPassword,
            role,
          }
        ])
        .select('id, username, game_nick, role, created_at')
        .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      return NextResponse.json({
        error: "Не удалось создать пользователя",
        details: error.message
      }, { status: 500 })
    }

    console.log("[v0] Users API: User created successfully:", username)
    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("[v0] Users API: Error creating user:", error)
    return NextResponse.json({ error: "Ошибка при создании пользователя" }, { status: 500 })
  }
}

// PATCH - Update user role
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { userId, role } = body

    console.log("[v0] Users API: Updating user role:", userId, "to", role)

    if (!userId || !role) {
      return NextResponse.json({ error: "ID пользователя и роль обязательны" }, { status: 400 })
    }

    // Check if user exists and get their current role
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Don't allow changing root user's role
    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя изменить роль root пользователя" }, { status: 403 })
    }

    // Update user role
    const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId)
        .select('id, username, game_nick, role, created_at')
        .single()

    if (updateError) {
      console.error("[v0] Supabase error:", updateError)
      return NextResponse.json({ error: "Не удалось обновить роль" }, { status: 500 })
    }

    console.log("[v0] Users API: User role updated successfully")
    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("[v0] Users API: Error updating user:", error)
    return NextResponse.json({ error: "Ошибка при обновлении роли" }, { status: 500 })
  }
}

// DELETE - Delete user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("id")

    console.log("[v0] Users API: Deleting user:", userId)

    if (!userId) {
      return NextResponse.json({ error: "ID пользователя обязателен" }, { status: 400 })
    }

    // Check if user exists and get their role
    const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

    if (fetchError || !existingUser) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 })
    }

    // Don't allow deleting root user
    if (existingUser.role === "root") {
      return NextResponse.json({ error: "Нельзя удалить root пользователя" }, { status: 403 })
    }

    // Delete user
    const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

    if (deleteError) {
      console.error("[v0] Supabase error:", deleteError)
      return NextResponse.json({ error: "Не удалось удалить пользователя" }, { status: 500 })
    }

    console.log("[v0] Users API: User deleted successfully")
    return NextResponse.json({ message: "Пользователь успешно удален" })
  } catch (error) {
    console.error("[v0] Users API: Error deleting user:", error)
    return NextResponse.json({ error: "Ошибка при удалении пользователя" }, { status: 500 })
  }
}