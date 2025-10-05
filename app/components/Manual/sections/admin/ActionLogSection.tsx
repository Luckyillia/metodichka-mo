"use client"

import { useEffect, useState } from "react"
import { AuthService } from "@/lib/auth/auth-service"
import type { ActionLog } from "@/lib/auth/types"
import { Clock, User, Activity } from "lucide-react"

export default function ActionLogSection() {
    const [logs, setLogs] = useState<ActionLog[]>([])
    const [filter, setFilter] = useState<string>("")

    useEffect(() => {
        // Load logs on mount
        const actionLogs = AuthService.getActionLogs()
        setLogs(actionLogs)

        // Refresh logs every 30 seconds
        const interval = setInterval(() => {
            const updatedLogs = AuthService.getActionLogs()
            setLogs(updatedLogs)
        }, 30000)

        return () => clearInterval(interval)
    }, [])

    const filteredLogs = logs.filter(
        (log) =>
            log.game_nick.toLowerCase().includes(filter.toLowerCase()) ||
            log.action.toLowerCase().includes(filter.toLowerCase()),
    )

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp)
        return date.toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
    }

    return (
        <div className="space-y-6">
            <div className="subsection">
                <h3 className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Журнал действий администраторов
                </h3>
                <p className="text-slate-300 mb-4">
                    В этом разделе отображаются все действия пользователей с правами администратора и root.
                </p>

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Поиск по нику или действию..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {filteredLogs.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                        <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>Журнал действий пуст</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredLogs.map((log) => (
                            <div
                                key={log.id}
                                className="bg-gray-900/30 backdrop-blur-md border border-gray-700/50 rounded-lg p-4 hover:bg-gray-900/40 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-3">
                                            <User className="w-4 h-4 text-blue-400" />
                                            <span className="font-medium text-blue-300">{log.game_nick}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Activity className="w-4 h-4 text-green-400" />
                                            <span className="text-slate-200">{log.action}</span>
                                        </div>
                                        {log.details && <div className="text-sm text-slate-400 ml-7">{log.details}</div>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                        <Clock className="w-4 h-4" />
                                        <span>{formatDate(log.timestamp)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="note">
                <strong>Примечание:</strong>
                <p>
                    Журнал действий автоматически фиксирует все важные операции, выполняемые администраторами и пользователями с
                    правами root. Записи включают вход в систему, выход, изменение данных пользователей и другие критические
                    действия.
                </p>
            </div>
        </div>
    )
}
