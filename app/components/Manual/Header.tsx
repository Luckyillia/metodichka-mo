"use client"

import Link from "next/link"
import { Users, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      root: { label: "ГС", color: "bg-purple-600" },
      admin: { label: "ПГС", color: "bg-red-600" },
      ld: { label: "Лидер", color: "bg-blue-600" },
      cc: { label: "CC", color: "bg-blue-600" },
      user: { label: "Пользователь", color: "bg-green-600" },
    }
    return badges[role as keyof typeof badges] || { label: role, color: "bg-gray-600" }
  }

  return (
    <header className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎖️</span>
            <h1 className="text-xl font-semibold text-white">Методичка для Министерства Обороны</h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-800/50 rounded-lg border border-slate-700">
                  <Shield className="w-4 h-4 text-slate-400"/>
                  <div className="flex flex-col">
                    <span className="text-sm text-slate-200 font-medium">{user.game_nick}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(user.role).color} text-white w-fit`}>
                      {getRoleBadge(user.role).label}
                    </span>
                  </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-600"
                >
                  <LogOut className="w-4 h-4"/>
                  <span>Выйти</span>
                </button>
              </>
            ) : (
                <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 text-slate-200 hover:bg-slate-700 transition-colors border border-slate-600"
              >
                <Users className="w-4 h-4" />
                <span>Войти</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
