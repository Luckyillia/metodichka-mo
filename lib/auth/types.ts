export type UserRole = "guest" | "user" | "cc" | "admin" | "root"

export interface User {
  id: string
  username: string
  game_nick: string
  role: "root" | "admin" | "cc" | "user"
  created_at: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface ActionLog {
  id: string
  user_id: string
  game_nick: string
  action: string
  timestamp: string
  details?: string
}
