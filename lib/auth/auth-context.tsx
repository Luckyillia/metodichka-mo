"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { AuthState } from "./types"
import { AuthService } from "./auth-service"

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  canAccessSection: (sectionId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    console.log("[v0] AuthProvider: Checking for existing session")
    const user = AuthService.getCurrentUser()
    console.log("[v0] AuthProvider: Loaded user from storage:", user)
    setState({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    })
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("[v0] AuthContext: Starting login for username:", username)
    const user = await AuthService.login(username, password)
    console.log("[v0] AuthContext: Login result:", user)

    if (user) {
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
      })
      console.log("[v0] AuthContext: State updated with user:", user)
      return true
    }

    console.log("[v0] AuthContext: Login failed")
    return false
  }

  const logout = () => {
    AuthService.logout()
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const canAccessSection = (sectionId: string): boolean => {
    return AuthService.canAccessSection(state.user, sectionId)
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        canAccessSection,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
