// lib/auth/auth-service.ts
import type { User, ActionLog } from "./types"
import CryptoJS from "crypto-js"
import { ENCRYPTION_KEY, AUTH_STORAGE_KEY, SESSION_DURATION } from "./constants"

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      console.log('[AuthService] Attempting login for:', username)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        console.error('[AuthService] Login failed with status:', response.status)
        return null
      }

      const user = await response.json()
      console.log('[AuthService] Login successful, user:', user.username, 'role:', user.role)

      const authToken = this.createAuthToken(user)
      this.saveEncryptedUser(authToken)

      return user
    } catch (error) {
      console.error("[AuthService] Login error:", error)
      return null
    }
  }

  static createAuthToken(user: User): string {
    const tokenData = {
      ...user,
      loginTimestamp: Date.now(),
      timestamp: Date.now(),
      signature: this.createSignature(user),
    }

    return Buffer.from(JSON.stringify(tokenData)).toString("base64")
  }

  static createSignature(user: User): string {
    const signatureData = `${user.id}:${user.username}:${user.role}:${user.game_nick}`
    return CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()
  }

  static verifyTokenSignature(token: string): boolean {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())

      const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
      if (Date.now() - loginTimestamp > SESSION_DURATION) {
        console.warn('[AuthService] Token expired')
        return false
      }

      const expectedSignature = this.createSignature(decoded)
      return decoded.signature === expectedSignature
    } catch (error) {
      console.error('[AuthService] Token verification error:', error)
      return false
    }
  }

  static saveEncryptedUser(token: string): void {
    if (typeof window !== "undefined") {
      try {
        const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
        localStorage.setItem(AUTH_STORAGE_KEY, encrypted)
      } catch (error) {
        console.error('[AuthService] Error saving token:', error)
      }
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

    const encrypted = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!encrypted) {
      return null
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
      const token = bytes.toString(CryptoJS.enc.Utf8)

      if (!token || !this.verifyTokenSignature(token)) {
        this.logout()
        return null
      }

      const userData = JSON.parse(Buffer.from(token, "base64").toString())
      const { timestamp, signature, loginTimestamp, ...user } = userData

      return user as User
    } catch (error) {
      console.error("[AuthService] Error decrypting user:", error)
      this.logout()
      return null
    }
  }

  static getAuthToken(): string | null {
    if (typeof window === "undefined") {
      return null
    }

    const encrypted = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!encrypted) {
      return null
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
      const token = bytes.toString(CryptoJS.enc.Utf8)

      if (!token || !this.verifyTokenSignature(token)) {
        return null
      }

      return token
    } catch (error) {
      console.error('[AuthService] Error retrieving token:', error)
      return null
    }
  }

  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken()

    if (!token) {
      throw new Error("No authentication token")
    }

    const headers = new Headers(options.headers)
    headers.set("Authorization", `Bearer ${token}`)

    return fetch(url, {
      ...options,
      headers,
    })
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
      "parking-spaces",
      "exam-section",
      "ammunition-supplies",
    ]

    const ccSections = [...publicSections, "goss-wave", "announcements", "forum-responses", "report-generator"]
    const privilegedSections = [...ccSections, "user-management", "action-log"]

    if (!user) {
      return publicSections.includes(sectionId)
    }

    switch (user.role) {
      case "root":
      case "admin":
        return privilegedSections.includes(sectionId)
      case "cc":
        return ccSections.includes(sectionId)
      case "user":
        return publicSections.includes(sectionId)
      default:
        return publicSections.includes(sectionId)
    }
  }

  static async logAction(
      userId: string,
      gameNick: string,
      action: string,
      actionType: "create" | "update" | "delete" | "role_change" | "login" | "logout" | "deactivate" | "restore" | "other" = "other",
      targetType?: "user" | "system" | "report" | "other",
      targetId?: string,
      targetName?: string,
      details?: string,
      metadata?: Record<string, any>
  ): Promise<void> {
    try {
      await this.fetchWithAuth("/api/action-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action,
          action_type: actionType,
          target_type: targetType,
          target_id: targetId,
          target_name: targetName,
          details,
          metadata,
        }),
      })
    } catch (error) {
      console.error("[AuthService] Error logging action:", error)
    }
  }

  static async getActionLogs(
      limit: number = 100,
      offset: number = 0,
      filters?: {
        action_type?: string
        target_type?: string
        user_id?: string
      }
  ): Promise<{ logs: ActionLog[]; total: number }> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      })

      if (filters?.action_type) params.append("action_type", filters.action_type)
      if (filters?.target_type) params.append("target_type", filters.target_type)
      if (filters?.user_id) params.append("user_id", filters.user_id)

      const response = await this.fetchWithAuth(`/api/action-logs?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch logs: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error("[AuthService] Error fetching logs:", error)
      return { logs: [], total: 0 }
    }
  }

  // Новые методы для работы с пользователями
  static async getUsers(): Promise<User[]> {
    try {
      const response = await this.fetchWithAuth("/api/users")

      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error fetching users:", error)
      return []
    }
  }

  static async createUser(username: string, gameNick: string, password: string, role: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, gameNick, password, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create user")
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error creating user:", error)
      throw error
    }
  }

  static async updateUser(userId: string, username: string, gameNick: string, password?: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, username, gameNick, password }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update user")
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error updating user:", error)
      throw error
    }
  }

  static async updateUserRole(userId: string, role: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to update role")
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error updating role:", error)
      throw error
    }
  }

  static async deactivateUser(userId: string): Promise<void> {
    try {
      const response = await this.fetchWithAuth(`/api/users?id=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to deactivate user")
      }
    } catch (error) {
      console.error("[AuthService] Error deactivating user:", error)
      throw error
    }
  }

  static async restoreUser(userId: string): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action: "restore" }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to restore user")
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error restoring user:", error)
      throw error
    }
  }

  static async undoAction(logId: string): Promise<{ success: boolean; message: string; restoredUser?: User }> {
    try {
      const response = await this.fetchWithAuth("/api/users/undo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to undo action")
      }

      return await response.json()
    } catch (error) {
      console.error("[AuthService] Error undoing action:", error)
      throw error
    }
  }
}