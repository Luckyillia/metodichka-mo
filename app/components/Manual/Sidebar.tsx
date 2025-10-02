"use client"

import type { NavItem } from "@/types/manualTypes"
import { useAuth } from "@/lib/auth/auth-context"

interface SidebarProps {
  navItems: NavItem[]
  activeSection: string
  setActiveSection: (id: string) => void
}

export default function Sidebar({ navItems, activeSection, setActiveSection }: SidebarProps) {
  const { canAccessSection } = useAuth()

  return (
    <nav className="bg-gray-900/30 backdrop-blur-md rounded-lg border border-gray-700/50 p-4 sticky top-24 shadow-xl max-h-[calc(100vh-7rem)] overflow-y-auto">
      <ul className="space-y-1 list-none">
        {navItems.map((item) => {
          const hasAccess = canAccessSection(item.id)

          if (!hasAccess) {
            return null
          }

          return (
            <li key={item.id}>
              <button
                onClick={() => setActiveSection(item.id)}
                className={`
                  w-full text-left px-4 py-3 rounded-md transition-all duration-200 flex items-center gap-3
                  ${
                    activeSection === item.id
                      ? "bg-gray-700/80 text-white shadow-md font-medium"
                      : "text-gray-300 hover:bg-gray-800/50 hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm flex-1">{item.title}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
