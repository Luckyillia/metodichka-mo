"use client"

import { useAuth } from "@/lib/auth/auth-context"

const OverviewSection = () => {
  const { canAccessSection } = useAuth()

  // Маппинг между отображаемыми названиями и ID секций в системе авторизации
  const sections = [
    {
      id: "lectures",
      title: "Лекции",
      description: "Проведение учебных занятий",
      icon: "•"
    },
    {
      id: "training",
      title: "Тренировки",
      description: "Организация практических занятий",
      icon: "•"
    },
    {
      id: "events",
      title: "Мероприятия",
      description: "Список основных мероприятий МО",
      icon: "•"
    },
    {
      id: "rp-task",
      title: "РП задания",
      description: "Практические применение изученного материала",
      icon: "•"
    },
    {
      id: "exam-section",
      title: "Правила проведения экзаменов",
      description: "Процедуры проведения экзаменов",
      icon: "•"
    },
    {
      id: "ammunition-supplies",
      title: "Правила поставки боеприпасов",
      description: "Краткое руководство для поставок",
      icon: "•"
    },
    {
      id: "parking-spaces",
      title: "Парковочные места ВЧ",
      description: "Список допущенного транспорта на въезд",
      icon: "•"
    },
    {
      id: "interview-conscript",
      title: "Собеседование (Срочная)",
      description: "Алгоритмы основных действий при проведение призыва",
      icon: "•"
    },
    {
      id: "interview-contract",
      title: "Собеседование (Контракт)",
      description: "Шаблонные действие при приеме граждан",
      icon: "•"
    },
    {
      id: "ministry-of-defense",
      title: "Доклады и Тен-коды",
      description: "Руководство по докладам и кодам",
      icon: "•"
    },
    {
      id: "goss-wave",
      title: "Гос Волна",
      description: "Работа с государственной волной",
      icon: "•"
    },
    {
      id: "announcements",
      title: "Шаблоны для Доски Объявлений",
      description: "Стандартные отписи в ДО",
      icon: "•"
    },
    {
      id: "forum-responses",
      title: "Работа по форуму",
      description: "Краткое описание для работы по форуму",
      icon: "•"
    },
    {
      id: "report-generator",
      title: "Генератор отчетов",
      description: "Инструмент для создания отчетов",
      icon: "•"
    },
    {
      id: "user-management",
      title: "Управление пользователями",
      description: "Администрирование пользователей системы",
      icon: "•"
    },
    {
      id: "action-log",
      title: "Журнал действий",
      description: "История действий в системе",
      icon: "•"
    }
  ]

  // Фильтруем секции по правам доступа
  const accessibleSections = sections.filter(section => canAccessSection(section.id))

  return (
    <div className="space-y-6">
      <div className="subsection">
        <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2">
          <span>📋</span>
          Разделы методички:
        </h3>
        <ul className="space-y-3 text-slate-200">
          {accessibleSections.map((section) => (
            <li key={section.id} className="flex items-start gap-3">
              <span className="text-blue-400 mt-1">{section.icon}</span>
              <div>
                <strong className="text-white">{section.title}</strong> - {section.description}
              </div>
            </li>
          ))}
        </ul>

        {accessibleSections.length === 0 && (
          <div className="text-center text-slate-400 py-8">
            Нет доступных разделов для вашей роли.
          </div>
        )}
      </div>

      {/* Примечание о цветовой индикации фраз */}
      <div className="subsection">
        <div className="flex items-start gap-3">
          <span className="text-blue-400 text-lg">ℹ️</span>
          <div className="text-sm text-slate-300">
            <p className="mb-2">
              <strong className="text-slate-200">Цветовая индикация фраз копирования:</strong>
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-blue-500 border border-green-400/50"></div>
                <span className="text-green-300">МС - Младший состав</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-r from-orange-400 to-orange-600 border border-orange-400/50"></div>
                <span className="text-orange-300">СС - Старший состав</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-5">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="text-amber-100">
            <strong className="text-amber-200">Важно:</strong> Данная методичка содержит большинство инструкций для
            работы. Используйте навигацию слева для быстрого перехода к нужному разделу.
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewSection
