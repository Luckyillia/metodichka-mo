// lib/auth/auth-service.ts
import type { User } from "./types"
import CryptoJS from 'crypto-js'

const AUTH_STORAGE_KEY = "mod_auth_encrypted"
const ENCRYPTION_KEY = process.env.MZ_ENCRYPTION_KEY || 'fallback-key-change-in-production'

export class AuthService {
  static async login(username: string, password: string): Promise<User | null> {
    try {
      console.log("[v1] AuthService: Sending login request for:", username)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      console.log("[v1] AuthService: Response status:", response.status)

      if (!response.ok) {
        console.log("[v1] AuthService: Login failed with status:", response.status)
        return null
      }

      const user = await response.json()
      console.log("[v1] AuthService: Received user data:", user)

      // Создаем токен аутентификации
      const authToken = this.createAuthToken(user)

      // Шифруем и сохраняем
      this.saveEncryptedUser(authToken)

      return user
    } catch (error) {
      console.error("[v1] AuthService: Login error:", error)
      return null
    }
  }

  static createAuthToken(user: User): string {
    const tokenData = {
      ...user,
      timestamp: Date.now(),
      signature: this.createSignature(user)
    }

    return Buffer.from(JSON.stringify(tokenData)).toString('base64')
  }

  static createSignature(user: User): string {
    // Создаем цифровую подпись для проверки целостности
    const signatureData = `${user.id}:${user.username}:${user.role}:${user.game_nick}`
    return CryptoJS.HmacSHA256(signatureData, ENCRYPTION_KEY).toString()
  }

  static verifyTokenSignature(token: string): boolean {
    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())

      // Проверяем срок действия (24 часа)
      if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
        return false
      }

      // Проверяем подпись
      const expectedSignature = this.createSignature(decoded)
      return decoded.signature === expectedSignature
    } catch {
      return false
    }
  }

  static saveEncryptedUser(token: string): void {
    if (typeof window !== "undefined") {
      // Шифруем данные перед сохранением
      const encrypted = CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString()
      localStorage.setItem(AUTH_STORAGE_KEY, encrypted)
      console.log("[v1] AuthService: Encrypted user saved to localStorage")
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
      // Дешифруем данные
      const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY)
      const token = bytes.toString(CryptoJS.enc.Utf8)

      if (!token || !this.verifyTokenSignature(token)) {
        this.logout()
        return null
      }

      const userData = JSON.parse(Buffer.from(token, 'base64').toString())
      // Удаляем служебные поля
      const { timestamp, signature, ...user } = userData
      return user as User
    } catch (error) {
      console.error("[v1] AuthService: Error decrypting user:", error)
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