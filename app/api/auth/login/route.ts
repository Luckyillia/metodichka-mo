// app/api/login/route.ts (или app/api/auth/login/route.ts)
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    console.log("[v0] Login API: Login attempt for username:", username)

    // Валидация
    if (!username || !password) {
      return NextResponse.json(
          { error: "Имя пользователя и пароль обязательны" },
          { status: 400 }
      )
    }

    // Ищем пользователя в Supabase
    const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .single()

    if (fetchError || !user) {
      console.log("[v0] Login API: User not found:", username)
      return NextResponse.json(
          { error: "Неверное имя пользователя или пароль" },
          { status: 401 }
      )
    }

    // Проверяем пароль с помощью bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      console.log("[v0] Login API: Invalid password for user:", username)
      return NextResponse.json(
          { error: "Неверное имя пользователя или пароль" },
          { status: 401 }
      )
    }

    // Возвращаем пользователя БЕЗ пароля
    const { password: _, ...safeUser } = user
    console.log("[v0] Login API: Login successful for user:", safeUser.username)

    return NextResponse.json(safeUser)
  } catch (error) {
    console.error("[v0] Login API: Error:", error)
    return NextResponse.json(
        { error: "Ошибка при входе в систему" },
        { status: 500 }
    )
  }
}