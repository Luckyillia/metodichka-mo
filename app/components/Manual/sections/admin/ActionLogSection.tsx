"use client"

import React, { useState, useEffect } from "react"
import { AuthService } from "@/lib/auth/auth-service"
import type { ActionLog } from "@/lib/auth/types"
import {
    Clock,
    User,
    FileText,
    Filter,
    ChevronLeft,
    ChevronRight,
    Eye,
    Undo2,
    Loader2,
    RotateCcw,
    AlertCircle, X, CheckCircle
} from "lucide-react"
import {useAuth} from "@/lib/auth/auth-context";

export default function ActionLogSection() {
    const { user } = useAuth()
    const [logs, setLogs] = useState<ActionLog[]>([])
    const [filteredLogs, setFilteredLogs] = useState<ActionLog[]>([])
    const [total, setTotal] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedActionType, setSelectedActionType] = useState<string>("all")
    const [selectedTargetType, setSelectedTargetType] = useState<string>("all")
    const [selectedLog, setSelectedLog] = useState<ActionLog | null>(null)

    const logsPerPage = 5

    useEffect(() => {
        loadLogs()
    }, [currentPage, selectedActionType, selectedTargetType])

    const loadLogs = async () => {
        setIsLoading(true)
        try {
            const filters: any = {}
            if (selectedActionType !== "all") filters.action_type = selectedActionType
            if (selectedTargetType !== "all") filters.target_type = selectedTargetType

            const { logs: fetchedLogs, total: totalCount } = await AuthService.getActionLogs(
                logsPerPage,
                (currentPage - 1) * logsPerPage,
                filters
            )

            setLogs(fetchedLogs)
            setFilteredLogs(fetchedLogs)
            setTotal(totalCount)
        } catch (error) {
            console.error("Failed to load logs:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date)
    }

    const canUndo = (log: ActionLog) => {
        if (log.user_id !== user?.id) return false
        if (log.undone) return false
        return ["deactivate", "role_change", "update"].includes(log.action_type)
    }

    const getActionTypeColor = (type: string) => {
        const colors: Record<string, string> = {
            create: "bg-green-600",
            update: "bg-blue-600",
            delete: "bg-red-600",
            role_change: "bg-purple-600",
            login: "bg-teal-600",
            logout: "bg-gray-600",
            other: "bg-slate-600",
            restore: "bg-emerald-600",
            deactivate: "bg-orange-600",
        }
        return colors[type] || "bg-gray-600"
    }

    const getActionTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            create: "Создание",
            update: "Обновление",
            delete: "Удаление",
            role_change: "Смена роли",
            login: "Вход",
            logout: "Выход",
            other: "Другое",
            restore: "Восстановление",
            deactivate: "Деактивация",
        }
        return labels[type] || type
    }

    const getTargetTypeLabel = (type?: string) => {
        if (!type) return "—"
        const labels: Record<string, string> = {
            user: "Пользователь",
            system: "Система",
            report: "Отчет",
            other: "Другое",
        }
        return labels[type] || type
    }

    const totalPages = Math.ceil(total / logsPerPage)

    const handleUndoAction = async (logId: string) => {
        if (!confirm("Вы уверены, что хотите отменить это действие?")) {
            return
        }

        setError("")
        setSuccess("")

        try {
            const result = await AuthService.undoAction(logId)
            setSuccess(result.message)
            loadLogs()
        } catch (err: any) {
            setError(err.message || "Не удалось отменить действие")
        }
    }

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1)
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
    }

    const DetailModal = ({ log, onClose }: { log: ActionLog; onClose: () => void }) => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">Детали записи</h3>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Пользователь</p>
                            <p className="text-white font-medium">{log.game_nick}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Дата и время</p>
                            <p className="text-white">{formatDate(log.created_at)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Тип действия</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getActionTypeColor(log.action_type)}`}>
                {getActionTypeLabel(log.action_type)}
              </span>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Целевой объект</p>
                            <p className="text-white">{getTargetTypeLabel(log.target_type)}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-slate-400 mb-1">Действие</p>
                        <p className="text-white">{log.action}</p>
                    </div>

                    {log.target_name && (
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Целевое имя</p>
                            <p className="text-white">{log.target_name}</p>
                        </div>
                    )}

                    {log.details && (
                        <div>
                            <p className="text-sm text-slate-400 mb-1">Подробности</p>
                            <p className="text-slate-300 text-sm">{log.details}</p>
                        </div>
                    )}

                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                        <div>
                            <p className="text-sm text-slate-400 mb-2">Метаданные</p>
                            <div className="bg-slate-900/50 rounded p-4 border border-slate-700">
                <pre className="text-xs text-slate-300 overflow-x-auto">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
                            </div>
                        </div>
                    )}

                    {(log.ip_address && user?.role === "root") && (
                        <div>
                            <p className="text-sm text-slate-400 mb-1">IP адрес</p>
                            <p className="text-white font-mono text-sm">{log.ip_address}</p>
                        </div>
                    )}

                    {(log.user_agent && user?.role === "root") && (
                        <div>
                            <p className="text-sm text-slate-400 mb-1">User Agent</p>
                            <p className="text-slate-300 text-xs break-all">{log.user_agent}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                            <p className="text-sm text-slate-400 mb-1">ID записи</p>
                            <p className="text-slate-300 font-mono text-xs break-all">{log.id}</p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 mb-1">ID пользователя</p>
                            <p className="text-slate-300 font-mono text-xs break-all">{log.user_id}</p>
                        </div>
                    </div>

                    {log.target_id && (
                        <div>
                            <p className="text-sm text-slate-400 mb-1">ID целевого объекта</p>
                            <p className="text-slate-300 font-mono text-xs break-all">{log.target_id}</p>
                        </div>
                    )}
                </div>

                <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Закрыть
                    </button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-6">
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
            <div className="bg-slate-900/50 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-400" />
                    Фильтры
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Тип действия
                        </label>
                        <select
                            value={selectedActionType}
                            onChange={(e) => {
                                setSelectedActionType(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Все типы</option>
                            <option value="create">Создание</option>
                            <option value="update">Обновление</option>
                            <option value="delete">Удаление</option>
                            <option value="role_change">Смена роли</option>
                            <option value="login">Вход</option>
                            <option value="logout">Выход</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                            Целевой объект
                        </label>
                        <select
                            value={selectedTargetType}
                            onChange={(e) => {
                                setSelectedTargetType(e.target.value)
                                setCurrentPage(1)
                            }}
                            className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Все объекты</option>
                            <option value="user">Пользователь</option>
                            <option value="system">Система</option>
                            <option value="report">Отчет</option>
                            <option value="other">Другое</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900/50 rounded-lg border border-slate-700 overflow-hidden">
                <div className="p-6 border-b border-slate-700">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-400" />
                        Журнал действий ({total} записей)
                    </h2>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        <p className="mt-4 text-slate-400">Загрузка логов...</p>
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Записи не найдены</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Дата и время
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Пользователь
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Тип
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Действие
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Цель
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                        Детали
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700">
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-sm text-slate-300">
                                                <Clock className="w-4 h-4 text-slate-500" />
                                                {formatDate(log.created_at)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-slate-500" />
                                                <span className="text-sm font-medium text-white">{log.game_nick}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white ${getActionTypeColor(log.action_type)}`}>
                                              {getActionTypeLabel(log.action_type)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-200">{log.action}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm text-slate-300">{log.target_name || getTargetTypeLabel(log.target_type)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                                Показать
                                            </button>
                                            {canUndo(log) && (
                                                <button
                                                    onClick={() => handleUndoAction(log.id)}
                                                    className="flex items-center gap-1 text-sm text-orange-400 hover:text-orange-300 transition-colors"
                                                    title="Отменить действие"
                                                >
                                                    <RotateCcw className="w-4 h-4"/>
                                                    Отменить
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="px-6 py-4 border-t border-slate-700 flex items-center justify-between">
                                <div className="text-sm text-slate-400">
                                    Страница {currentPage} из {totalPages} (показано {filteredLogs.length} из {total})
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handlePreviousPage}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        Назад
                                    </button>
                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                    >
                                        Вперед
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedLog && <DetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />}
        </div>
    )
}