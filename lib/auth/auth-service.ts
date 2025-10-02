import type { User } from "./types"

const AUTH_STORAGE_KEY = "mod_auth_user"

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      console.log("[v0] AuthService: Sending login request for:", username)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      console.log("[v0] AuthService: Response status:", response.status)

      if (!response.ok) {
        console.log("[v0] AuthService: Login failed with status:", response.status)
        return null
      }

      const user = await response.json()
      console.log("[v0] AuthService: Received user data:", user)

      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
        console.log("[v0] AuthService: User saved to localStorage")
      }

      return user
    } catch (error) {
      console.error("[v0] AuthService: Login error:", error)
      return null
    }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") {
      return null
    }

    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) {
      return null
    }

    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  }

  static hasRole(user: User | null, allowedRoles: string[]): boolean {
    if (!user) return false
    return allowedRoles.includes(user.role)
  }

  static canAccessSection(user: User | null, sectionId: string): boolean {
    const publicSections = [
      "overview",
      "lectures",
      "training",
      "events",
      "rp-task",
      "interview-conscript",
      "interview-contract",
      "ministry-of-defense",
    ]

    const ccSections = [...publicSections, "goss-wave", "announcements", "forum-responses", "report-generator"]

    const adminSections = [...ccSections, "exam-section", "ammunition-supplies"]

    if (!user) {
      return publicSections.includes(sectionId)
    }

    switch (user.role) {
      case "root":
      case "admin":
        return true
      case "cc":
        return ccSections.includes(sectionId)
      case "user":
        return publicSections.includes(sectionId)
      default:
        return publicSections.includes(sectionId)
    }
  }
}
