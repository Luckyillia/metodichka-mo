// lib/auth/auth-service.ts
import type { User, ActionLog } from "./types"
import CryptoJS from "crypto-js"

const AUTH_STORAGE_KEY = "mod_auth_encrypted"
const ENCRYPTION_KEY = process.env.MZ_ENCRYPTION_KEY || "fallback-key-change-in-production"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        return null
      }

      const user = await response.json()

      const authToken = this.createAuthToken(user)

      // Encrypt and save
      this.saveEncryptedUser(authToken)

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
      loginTimestamp: Date.now(), // Store login time for 7-day expiration
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

      // Check 7-day session expiration
      const loginTimestamp = decoded.loginTimestamp || decoded.timestamp
      if (Date.now() - loginTimestamp > SESSION_DURATION) {
        return false
      }

      // Verify signature
      const expectedSignature = this.createSignature(decoded)
      return decoded.signature === expectedSignature
    } catch {
      return false
    }
  }

  static saveEncryptedUser(token: string): void {
    if (typeof window !== "undefined") {
      const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
      localStorage.setItem(AUTH_STORAGE_KEY, encrypted)
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
    } catch {
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

  static async logAction(userId: string, gameNick: string, action: string, details?: string): Promise<void> {
    try {
      const log: ActionLog = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        user_id: userId,
        game_nick: gameNick,
        action,
        timestamp: new Date().toISOString(),
        details,
      }

      // Store in localStorage for now (in production, this should be sent to a backend)
      const logs = this.getActionLogs()
      logs.unshift(log)

      // Keep only last 1000 logs
      const trimmedLogs = logs.slice(0, 1000)
      localStorage.setItem("mod_action_logs", JSON.stringify(trimmedLogs))
    } catch (error) {
      console.error("[AuthService] Error logging action:", error)
    }
  }

  static getActionLogs(): ActionLog[] {
    if (typeof window === "undefined") {
      return []
    }

    try {
      const logs = localStorage.getItem("mod_action_logs")
      return logs ? JSON.parse(logs) : []
    } catch {
      return []
    }
  }
}

