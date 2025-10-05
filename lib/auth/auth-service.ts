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
      console.log('[AuthService] Auth token created')

      // Encrypt and save
      this.saveEncryptedUser(authToken)
      console.log('[AuthService] Token saved to localStorage')

      if (user.role === "admin" || user.role === "root") {
        await this.logAction(user.id, user.game_nick, "Вход в систему")
      }

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

    const token = Buffer.from(JSON.stringify(tokenData)).toString("base64")
    console.log('[AuthService] Token created for user:', user.username)
    return token
  }

  static createSignature(user: User): string {
    const signatureData = `${user.id}:${user.username}:${user.role}:${user.game_nick}`
    const signature = CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()
    console.log('[AuthService] Signature created for:', user.username)
    return signature
  }

  static verifyTokenSignature(token: string): boolean {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString())

      // Check 7-day session expiration
      const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
      if (Date.now() - loginTimestamp > SESSION_DURATION) {
        console.warn('[AuthService] Token expired')
        return false
      }

      // Verify signature
      const expectedSignature = this.createSignature(decoded)
      const isValid = decoded.signature === expectedSignature

      if (!isValid) {
        console.error('[AuthService] Signature mismatch!')
        console.log('[AuthService] Expected:', expectedSignature)
        console.log('[AuthService] Got:', decoded.signature)
      }

      return isValid
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
        console.log('[AuthService] Token encrypted and saved')
      } catch (error) {
        console.error('[AuthService] Error saving token:', error)
      }
    }
  }

  static logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY)
      console.log('[AuthService] User logged out, token removed')
    }
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") {
      return null
    }

    const encrypted = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!encrypted) {
      console.log('[AuthService] No encrypted token found')
      return null
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
      const token = bytes.toString(CryptoJS.enc.Utf8)

      if (!token || !this.verifyTokenSignature(token)) {
        console.warn('[AuthService] Invalid token, logging out')
        this.logout()
        return null
      }

      const userData = JSON.parse(Buffer.from(token, "base64").toString())
      const { timestamp, signature, loginTimestamp, ...user } = userData

      console.log('[AuthService] Current user retrieved:', user.username, 'role:', user.role)
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
      console.log('[AuthService] No token to retrieve')
      return null
    }

    try {
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
      const token = bytes.toString(CryptoJS.enc.Utf8)

      if (!token || !this.verifyTokenSignature(token)) {
        console.warn('[AuthService] Token invalid or expired')
        return null
      }

      console.log('[AuthService] Auth token retrieved successfully')
      return token
    } catch (error) {
      console.error('[AuthService] Error retrieving token:', error)
      return null
    }
  }

  static async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getAuthToken()

    if (!token) {
      console.error("[AuthService] No authentication token found")
      throw new Error("No authentication token")
    }

    console.log("[AuthService] Making authenticated request to:", url)
    console.log("[AuthService] Token exists:", !!token)

    const headers = new Headers(options.headers)
    headers.set("Authorization", `Bearer ${token}`)

    console.log("[AuthService] Request headers:", Object.fromEntries(headers.entries()))

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
    ]

    const ccSections = [...publicSections, "goss-wave", "announcements", "forum-responses", "report-generator"]
    const adminSections = [...ccSections, "exam-section", "ammunition-supplies"]
    const privilegedSections = [...adminSections, "user-management", "action-log"]

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
      actionType: "create" | "update" | "delete" | "role_change" | "login" | "logout" | "other" = "other",
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

      console.log("[AuthService] Fetching logs with params:", params.toString())

      const response = await this.fetchWithAuth(`/api/action-logs?${params.toString()}`)

      if (!response.ok) {
        console.error("[AuthService] Failed to fetch logs, status:", response.status)
        const errorText = await response.text()
        console.error("[AuthService] Error response:", errorText)
        throw new Error(`Failed to fetch logs: ${response.status}`)
      }

      const data = await response.json()
      console.log("[AuthService] Logs fetched successfully:", data.logs?.length || 0)
      return data
    } catch (error) {
      console.error("[AuthService] Error fetching logs:", error)
      return { logs: [], total: 0 }
    }
  }
}