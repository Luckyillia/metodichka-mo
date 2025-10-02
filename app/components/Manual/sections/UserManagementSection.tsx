"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { Shield, Users, Crown, AlertCircle, CheckCircle, UserCog, UserPlus, Trash2, Loader2, Gamepad2 } from "lucide-react"

type User = {
  id: string
  username: string
  game_nick: string
  role: "root" | "admin" | "cc" | "user"
  created_at: string
}

export default function UserManagementSection() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    username: "",
    gameNick: "",
    password: "",
    role: "user" as "user" | "cc" | "admin",
  })

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setUsers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Failed to load users:", error)
      showNotification("error", "Не удалось загрузить пользователей")
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const validateGameNick = (nick: string): string | null => {
    const gameNickRegex = /^[A-Za-z]+_[A-Za-z]+$/

    if (!nick.trim()) {
      return "Игровой ник обязателен"
    }

    if (!gameNickRegex.test(nick)) {
      return "Используйте формат: Имя_Фамилия (только английские буквы)"
    }

    if (nick.length < 5 || nick.length > 50) {
      return "Ник должен быть от 5 до 50 символов"
    }

    return null
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.username || !newUser.gameNick || !newUser.password) {
      showNotification("error", "Все поля обязательны для заполнения")
      return
    }

    const nickError = validateGameNick(newUser.gameNick)
    if (nickError) {
      showNotification("error", nickError)
      return
    }

    if (newUser.password.length < 6) {
      showNotification("error", "Пароль должен содержать минимум 6 символов")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newUser),
      })

      const responseData = await response.json()

      if (response.ok) {
        await new Promise(resolve => setTimeout(resolve, 500))
        await loadUsers()
        setShowAddModal(false)
        setNewUser({ username: "", gameNick: "", password: "", role: "user" })
        showNotification("success", `Пользователь ${newUser.username} успешно добавлен`)
      } else {
        showNotification("error", responseData.error || "Не удалось добавить пользователя")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      showNotification("error", "Ошибка при добавлении пользователя")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: "admin" | "cc" | "user") => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (response.ok) {
        await loadUsers()
        showNotification("success", `Роль пользователя успешно изменена на ${newRole}`)
      } else {
        const error = await response.json()
        showNotification("error", error.error || "Не удалось изменить роль")
      }
    } catch (error) {
      showNotification("error", "Ошибка при изменении роли")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        await loadUsers()
        showNotification("success", "Пользователь успешно удален")
      } else {
        const error = await response.json()
        showNotification("error", error.error || "Не удалось удалить пользователя")
      }
    } catch (error) {
      showNotification("error", "Ошибка при удалении пользователя")
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadge = (role: string) => {
    const badges = {
      root: { label: "Root", color: "bg-purple-600", icon: Crown },
      admin: { label: "Администратор", color: "bg-red-600", icon: Shield },
      cc: { label: "CC", color: "bg-blue-600", icon: UserCog },
      user: { label: "Пользователь", color: "bg-green-600", icon: Users },
    }
    return badges[role as keyof typeof badges] || { label: role, color: "bg-gray-600", icon: Users }
  }

  return (
      <div className="space-y-6">
        {notification && (
            <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                    notification.type === "success"
                        ? "bg-green-900/30 border border-green-700 text-green-300"
                        : "bg-red-900/30 border border-red-700 text-red-300"
                }`}
            >
              {notification.type === "success" ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-300">Всего пользователей</span>
            </div>
            <div className="text-3xl font-semibold text-white">{users.length}</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-red-400" />
              <span className="text-sm text-slate-300">Администраторы</span>
            </div>
            <div className="text-3xl font-semibold text-white">
              {users.filter((u) => u.role === "admin" || u.role === "root").length}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <UserCog className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-300">CC аккаунты</span>
            </div>
            <div className="text-3xl font-semibold text-white">{users.filter((u) => u.role === "cc").length}</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-300">Обычные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-white">{users.filter((u) => u.role === "user").length}</div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Список пользователей</h2>
              <p className="text-sm text-slate-400 mt-1">
                {user?.role === "root"
                    ? "Вы можете изменять роли и управлять пользователями"
                    : "Просмотр пользователей (только Root может изменять роли)"}
              </p>
            </div>
            {user?.role === "root" && (
                <button
                    onClick={() => setShowAddModal(true)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                  Добавить пользователя
                </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {isLoading && users.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Users className="w-12 h-12 mb-3" />
                  <p>Пользователи не найдены</p>
                </div>
            ) : (
                <table className="w-full">
                  <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Пользователь</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Игровой ник</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Роль</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Дата создания</th>
                    {user?.role === "root" && (
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Действия</th>
                    )}
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                  {users.map((u) => {
                    const badge = getRoleBadge(u.role)
                    const Icon = badge.icon

                    return (
                        <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-medium text-white">{u.username}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Gamepad2 className="w-4 h-4 text-blue-400" />
                              <span className="font-mono">{u.game_nick}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${badge.color}`}>
                          {badge.label}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                            {new Date(u.created_at).toLocaleDateString("ru-RU")}
                          </td>
                          {user?.role === "root" && (
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  {u.role !== "root" ? (
                                      <>
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleRoleChange(u.id, e.target.value as "admin" | "cc" | "user")}
                                            disabled={isLoading}
                                            className="px-3 py-1.5 bg-slate-900 border border-slate-600 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                          <option value="user">Пользователь</option>
                                          <option value="cc">CC</option>
                                          <option value="admin">Администратор</option>
                                        </select>
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            disabled={isLoading}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </>
                                  ) : (
                                      <span className="text-sm text-slate-500 italic">Нельзя изменить</span>
                                  )}
                                </div>
                              </td>
                          )}
                        </tr>
                    )
                  })}
                  </tbody>
                </table>
            )}
          </div>
        </div>

        {showAddModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Добавить нового пользователя</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Имя пользователя</label>
                    <input
                        type="text"
                        value={newUser.username}
                        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        minLength={3}
                        maxLength={50}
                        placeholder="Логин для входа"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="w-4 h-4" />
                        Игровой ник
                      </div>
                    </label>
                    <input
                        type="text"
                        value={newUser.gameNick}
                        onChange={(e) => setNewUser({ ...newUser, gameNick: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        disabled={isLoading}
                        placeholder="Polter_Sokirovskiy"
                    />
                    <p className="text-xs text-slate-400 mt-1">Формат: Имя_Фамилия (только английские буквы)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Пароль</label>
                    <input
                        type="password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                        minLength={6}
                        placeholder="Минимум 6 символов"
                    />
                    <p className="text-xs text-slate-400 mt-1">Минимум 6 символов</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Роль</label>
                    <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value as "user" | "cc" | "admin" })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    >
                      <option value="user">Пользователь</option>
                      <option value="cc">CC</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                        onClick={handleAddUser}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Добавление...
                          </>
                      ) : (
                          "Добавить"
                      )}
                    </button>
                    <button
                        onClick={() => {
                          setShowAddModal(false)
                          setNewUser({ username: "", gameNick: "", password: "", role: "user" })
                        }}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}

        <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-6">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Информация о ролях</h3>
              <ul className="space-y-1 text-sm text-blue-200">
                <li>
                  <strong>Root:</strong> Полный доступ ко всем функциям, может назначать администраторов и CC
                </li>
                <li>
                  <strong>Администратор:</strong> Полный доступ к документации и управлению пользователями
                </li>
                <li>
                  <strong>CC:</strong> Доступ к расширенным разделам (Гос Волна, Шаблоны, Форум, Генератор отчетов)
                </li>
                <li>
                  <strong>Пользователь:</strong> Доступ к базовым разделам (Содержание, Лекции, Тренировки, Мероприятия, РП задания, Собеседования, Доклады)
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-900/20 border border-green-700 rounded-lg p-6">
          <div className="flex gap-3">
            <Gamepad2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-300 mb-2">Формат игрового ника</h3>
              <p className="text-sm text-green-200 mb-2">
                Игровой ник используется вместо email и должен соответствовать формату вашего ника в игре.
              </p>
              <div className="space-y-1 text-sm text-green-200">
                <div>✅ Правильно: <code className="bg-green-900/30 px-2 py-0.5 rounded">Polter_Sokirovskiy</code></div>
                <div>✅ Правильно: <code className="bg-green-900/30 px-2 py-0.5 rounded">John_Smith</code></div>
                <div>❌ Неправильно: <code className="bg-red-900/30 px-2 py-0.5 rounded">polter sokirovskiy</code></div>
                <div>❌ Неправильно: <code className="bg-red-900/30 px-2 py-0.5 rounded">Polter-Sokirovskiy</code></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}