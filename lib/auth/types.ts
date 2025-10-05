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
  action_type: 'create' | 'update' | 'delete' | 'role_change' | 'login' | 'logout' | 'other'
  target_type?: 'user' | 'system' | 'report' | 'other'
  target_id?: string
  target_name?: string
  details?: string
  metadata?: Record<string, any>
  ip_address?: string
  user_agent?: string
  created_at: string
}
