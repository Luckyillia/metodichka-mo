export type UserRole = "guest" | "user" | "cc" | "admin" | "root"

export interface User {
  id: string
  username: string
  game_nick: string  // изменено с email
  role: "root" | "admin" | "cc" | "user"
  created_at: string  // изменено с createdAt
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}
