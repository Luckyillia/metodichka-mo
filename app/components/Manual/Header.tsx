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
    <header className="bg-[#1a4d2e]/80 backdrop-blur-sm border-b border-[#2d6a4f]/50 sticky top-0 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎖️</span>
            <h1 className="text-xl font-semibold text-white">Методичка для Министерства Обороны</h1>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-[#1a4d2e]/30 rounded-lg border border-[#4ade80]/30">
                  <Shield className="w-4 h-4 text-slate-400"/>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-[#e8f5e9]">{user.game_nick}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(user.role).color} text-white w-fit`}>
                      {getRoleBadge(user.role).label}
                    </span>
                  </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a4d2e]/50 text-[#e8f5e9] hover:bg-[#2d6a4f] transition-colors border border-[#4ade80]/30"
                >
                  <LogOut className="w-4 h-4"/>
                  <span>Выйти</span>
                </button>
              </>
            ) : (
                <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a4d2e]/50 text-[#e8f5e9] hover:bg-[#2d6a4f] transition-colors border border-[#4ade80]/30"
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
