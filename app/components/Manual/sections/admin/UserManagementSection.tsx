// app/components/Manual/sections/admin/UserManagementSection.tsx
"use client"

import React, { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/auth-context"
import { AuthService } from "@/lib/auth/auth-service"
import type { User, ActionLog } from "@/lib/auth/types"
import {
  UserPlus,
  Edit,
  Trash2,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  Loader2,
  RotateCcw,
  Eye,
  EyeOff,
  UserCog,
  Users,
  UserStar,
  Gamepad2
} from "lucide-react"

export default function UserManagementSection() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showInactiveUsers, setShowInactiveUsers] = useState(false)
  const [changingRoleUser, setChangingRoleUser] = useState<User | null>(null)
  const [recentActions, setRecentActions] = useState<ActionLog[]>([])
  const [loadingActions, setLoadingActions] = useState(false)

  const [formData, setFormData] = useState({
    username: "",
    gameNick: "",
    password: "",
    role: "user",
  })

  const [editUser, setEditUser] = useState({
    id: "",
    username: "",
    gameNick: "",
    password: "",
    role: "" as "root" | "admin" | "ld" |"cc" | "user",
  })

  useEffect(() => {
    fetchUsers()
    fetchRecentActions()
  }, [])

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

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const fetchedUsers = await AuthService.getUsers()
      setUsers(fetchedUsers)
      setError("")
    } catch (err) {
      setError("Не удалось загрузить пользователей")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const fetchRecentActions = async () => {
    try {
      setLoadingActions(true)
      const { logs } = await AuthService.getActionLogs(10, 0, {
        target_type: "user",
      })
      setRecentActions(logs)
    } catch (err) {
      console.error("Failed to fetch recent actions:", err)
    } finally {
      setLoadingActions(false)
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      await AuthService.createUser(
          formData.username,
          formData.gameNick,
          formData.password,
          formData.role
      )

      setSuccess(`Пользователь ${formData.gameNick} успешно создан`)
      setShowCreateModal(false)
      setFormData({ username: "", gameNick: "", password: "", role: "user" })
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось создать пользователя")
    }
  }

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editUser.username || !editUser.gameNick) {
      setError("Имя пользователя и игровой ник обязательны")
      return
    }

    const nickError = validateGameNick(editUser.gameNick)
    if (nickError) {
      setError(nickError)
      return
    }

    if (editUser.password && editUser.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов")
      return
    }

    setLoading(true)

    try {
      await AuthService.updateUser(editUser.id, editUser.username, editUser.gameNick, (editUser.password || undefined))

      setShowEditModal(false)
      setEditUser({ id: "", username: "", gameNick: "", password: "", role: "user" })
      setSuccess("Пользователь успешно обновлен")
      fetchUsers()
    } catch (error) {
      setError("Ошибка при обновлении пользователя")
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!changingRoleUser) return

    setError("")
    setSuccess("")

    try {
      await AuthService.updateUserRole(changingRoleUser.id, formData.role)

      setSuccess(`Роль пользователя ${changingRoleUser.game_nick} изменена на ${formData.role}`)
      setShowRoleModal(false)
      setChangingRoleUser(null)
      setFormData({ username: "", gameNick: "", password: "", role: "user" })
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось изменить роль")
    }
  }

  const handleDeactivateUser = async (userId: string, gameNick: string) => {
    if (!confirm(`Вы уверены, что хотите деактивировать пользователя ${gameNick}?`)) {
      return
    }

    setError("")
    setSuccess("")

    try {
      await AuthService.deactivateUser(userId)
      setSuccess(`Пользователь ${gameNick} деактивирован`)
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось деактивировать пользователя")
    }
  }

  const handleRestoreUser = async (userId: string, gameNick: string) => {
    if (!confirm(`Вы уверены, что хотите восстановить пользователя ${gameNick}?`)) {
      return
    }

    setError("")
    setSuccess("")

    try {
      await AuthService.restoreUser(userId)
      setSuccess(`Пользователь ${gameNick} восстановлен`)
      fetchUsers()
      fetchRecentActions()
    } catch (err: any) {
      setError(err.message || "Не удалось восстановить пользователя")
    }
  }

  const openEditModal = (u: User) => {
    setEditUser({
      id: u.id,
      username: u.username,
      gameNick: u.game_nick,
      password: "",
      role: u.role,
    })
    setShowEditModal(true)
  }

  const openRoleModal = (user: User) => {
    setChangingRoleUser(user)
    setFormData({
      username: user.username,
      gameNick: user.game_nick,
      password: "",
      role: user.role,
    })
    setShowRoleModal(true)
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "root":
        return "bg-purple-600 text-white"
      case "admin":
        return "bg-red-600 text-white"
      case "ld":
        return "bg-pink-600 text-white"
      case "cc":
        return "bg-blue-600 text-white"
      case "user":
        return "bg-green-600 text-white"
      default:
        return "bg-gray-600 text-white"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "root":
        return "Суперадмин"
      case "admin":
        return "Администратор"
      case "ld":
        return "Лидер"
      case "cc":
        return "CC"
      case "user":
        return "Пользователь"
      default:
        return role
    }
  }

  const getActionTypeLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      create: "Создание",
      update: "Обновление",
      delete: "Удаление",
      role_change: "Изменение роли",
      deactivate: "Деактивация",
      restore: "Восстановление",
      login: "Вход",
      logout: "Выход",
      other: "Другое",
    }
    return labels[actionType] || actionType
  }

  const canUndo = (log: ActionLog) => {
    if (log.user_id !== currentUser?.id) return false
    if (log.undone) return false
    return ["deactivate", "restore", "role_change", "update"].includes(log.action_type)
  }

  const filteredUsers = showInactiveUsers
      ? users
      : users.filter((u) => u.active)

  const activeUsers = users.filter((u) => u.active)
  const inactiveUsers = users.filter((u) => !u.active)

  if (loading) {
    return (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-slate-400"/>
              <span className="text-sm text-slate-300">Всего пользователей</span>
            </div>
            <div className="text-3xl font-semibold text-white">{users.length}</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-400"/>
              <span className="text-sm text-slate-300">Активные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-white">{activeUsers.length}</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <EyeOff className="w-6 h-6 text-red-400"/>
              <span className="text-sm text-slate-300">Неактивные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-white">{inactiveUsers.length}</div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-5 h-5 text-red-400"/>
              <span className="text-sm text-slate-300">Администраторы</span>
            </div>
            <div className="text-3xl font-semibold text-white">
              {users.filter((u) => (  u.role === "admin" || u.role === "root")  && u.active).length}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <UserStar className="w-5 h-5 text-pink-400"/>
              <span className="text-sm text-slate-300">Лидеры</span>
            </div>
            <div className="text-3xl font-semibold text-white">
              {users.filter((u) => u.role === "ld" && u.active).length}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <UserCog className="w-5 h-5 text-blue-400"/>
              <span className="text-sm text-slate-300">CC аккаунты</span>
            </div>
            <div className="text-3xl font-semibold text-white">{users.filter((u) => u.role === "cc" && u.active).length}</div>
          </div>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-green-400"/>
              <span className="text-sm text-slate-300">Обычные пользователи</span>
            </div>
            <div className="text-3xl font-semibold text-white">{users.filter((u) => u.role === "user" && u.active).length}</div>
          </div>
        </div>

        {/* Alerts */}
        {error && (
            <div className="flex items-center gap-2 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300">
              <AlertCircle className="w-5 h-5 flex-shrink-0"/>
              <span>{error}</span>
              <button onClick={() => setError("")} className="ml-auto">
                <X className="w-5 h-5"/>
              </button>
            </div>
        )}

        {success && (
            <div
                className="flex items-center gap-2 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-300">
              <CheckCircle className="w-5 h-5 flex-shrink-0"/>
              <span>{success}</span>
              <button onClick={() => setSuccess("")} className="ml-auto">
                <X className="w-5 h-5"/>
              </button>
            </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <UserPlus className="w-5 h-5"/>
              Создать пользователя
            </button>

            {currentUser?.role === "root" && (
                <button
                    onClick={() => setShowInactiveUsers(!showInactiveUsers)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        showInactiveUsers
                            ? "bg-slate-600 text-white"
                            : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                    }`}
                >
                  {showInactiveUsers ? (
                      <>
                        <Eye className="w-5 h-5"/>
                        Показаны все
                      </>
                  ) : (
                      <>
                        <EyeOff className="w-5 h-5"/>
                        Показать неактивных
                      </>
                  )}
                </button>
            )}
          </div>

          <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5"/>
            Обновить
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-slate-700/50 rounded-lg border border-slate-600 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Игровой ник
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Логин
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Роль
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Дата создания
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Действия
                </th>
              </tr>
              </thead>
              <tbody className="divide-y divide-slate-600">
              {filteredUsers.map((user) => (
                  <tr
                      key={user.id}
                      className={`hover:bg-slate-700/30 transition-colors ${
                          !user.active ? "opacity-60" : ""
                      }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{user.game_nick}</span>
                        {!user.active && (
                            <span className="text-xs bg-red-900/30 text-red-400 px-2 py-1 rounded">
                          Деактивирован
                        </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                            user.role
                        )}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.active ? (
                          <span className="text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-4 h-4"/>
                        Активен
                      </span>
                      ) : (
                          <span className="text-red-400 flex items-center gap-1">
                        <X className="w-4 h-4"/>
                        Неактивен
                      </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString("ru-RU")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {/* Показываем кнопки только для активных пользователей и не для root (кроме случая редактирования себя) */}
                        {user.active && user.role !== "root" && (
                            <>
                              {/* Кнопка редактирования: root видит всех, admin видит только себя и не-админов */}
                              {(currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && (currentUser?.id === user.id || user.role !== "admin"))) && (
                                  <button
                                      onClick={() => openEditModal(user)}
                                      className="text-blue-400 hover:text-blue-300 transition-colors"
                                      title="Редактировать"
                                  >
                                    <Edit className="w-5 h-5"/>
                                  </button>
                              )}

                              {/* Кнопка изменения роли: только root или admin для не-админов, но не для себя */}
                              {(currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && user.role !== "admin")) &&
                                  currentUser?.id !== user.id && (
                                  <button
                                      onClick={() => openRoleModal(user)}
                                      className="text-purple-400 hover:text-purple-300 transition-colors"
                                      title="Изменить роль"
                                  >
                                    <Shield className="w-5 h-5"/>
                                  </button>
                              )}

                              {/* Кнопка деактивации: только root или admin для не-админов, но не для себя */}
                              {(currentUser?.role === "root" ||
                                  (currentUser?.role === "admin" && user.role !== "admin")) &&
                                  currentUser?.id !== user.id && (
                                  <button
                                      onClick={() => handleDeactivateUser(user.id, user.game_nick)}
                                      className="text-red-400 hover:text-red-300 transition-colors"
                                      title="Деактивировать"
                                  >
                                    <Trash2 className="w-5 h-5"/>
                                  </button>
                              )}
                            </>
                        )}

                        {/* Восстановление неактивных - только root */}
                        {!user.active && currentUser?.role === "root" && (
                            <button
                                onClick={() => handleRestoreUser(user.id, user.game_nick)}
                                className="text-green-400 hover:text-green-300 transition-colors"
                                title="Восстановить"
                            >
                              <RotateCcw className="w-5 h-5"/>
                            </button>
                        )}
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                  className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">Создать пользователя</h3>
                  <button
                      onClick={() => {
                        setShowCreateModal(false)
                        setFormData({username: "", gameNick: "", password: "", role: "user"})
                      }}
                      className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Игровой ник
                    </label>
                    <input
                        type="text"
                        value={formData.gameNick}
                        onChange={(e) => setFormData({...formData, gameNick: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Логин
                    </label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Пароль
                    </label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        minLength={6}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Роль
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">Пользователь</option>
                      <option value="cc">CC</option>
                      <option value="ld">Лидер</option>
                      {currentUser?.role === "root" && (
                          <>
                            <option value="admin">Администратор</option>
                          </>
                      )}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Save className="w-5 h-5"/>
                      Сохранить
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowCreateModal(false)
                          setFormData({username: "", gameNick: "", password: "", role: "user"})
                        }}
                        className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-lg max-w-md w-full p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Редактировать пользователя</h3>
                <form onSubmit={handleEditUser} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Имя пользователя</label>
                    <input
                        type="text"
                        value={editUser.username}
                        onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                        minLength={3}
                        maxLength={50}
                        placeholder="Логин для входа"
                        required
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
                        value={editUser.gameNick}
                        onChange={(e) => setEditUser({ ...editUser, gameNick: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                        disabled={loading}
                        placeholder="Polter_Sokirovskiy"
                        required
                    />
                    <p className="text-xs text-slate-400 mt-1">Формат: Имя_Фамилия (только английские буквы)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Новый пароль (опционально)</label>
                    <input
                        type="password"
                        value={editUser.password}
                        onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={loading}
                        minLength={6}
                        placeholder="Оставьте пустым, чтобы не менять"
                    />
                    <p className="text-xs text-slate-400 mt-1">Оставьте пустым, если не хотите менять пароль</p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Сохранение...
                          </>
                      ) : (
                          "Сохранить"
                      )}
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false)
                          setEditUser({ id: "", username: "", gameNick: "", password: "", role: "user" })
                        }}
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}

        {/* Change Role Modal */}
        {showRoleModal && changingRoleUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div
                  className="bg-slate-800 rounded-lg border border-slate-700 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-white">
                    Изменить роль: {changingRoleUser.game_nick}
                  </h3>
                  <button
                      onClick={() => {
                        setShowRoleModal(false)
                        setChangingRoleUser(null)
                        setFormData({username: "", gameNick: "", password: "", role: "user"})
                      }}
                      className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6"/>
                  </button>
                </div>

                <form onSubmit={handleChangeRole} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Текущая роль
                    </label>
                    <div className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg">
                  <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(
                          changingRoleUser.role
                      )}`}
                  >
                    {getRoleLabel(changingRoleUser.role)}
                  </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Новая роль
                    </label>
                    <select
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="user">Пользователь</option>
                      <option value="cc">CC</option>
                      <option value="ld">Лидер</option>
                      {currentUser?.role === "root" && (
                          <>
                            <option value="admin">Администратор</option>
                          </>
                      )}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Shield className="w-5 h-5"/>
                      Изменить роль
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                          setShowRoleModal(false)
                          setChangingRoleUser(null)
                          setFormData({username: "", gameNick: "", password: "", role: "user"})
                        }}
                        className="flex-1 px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  )
}