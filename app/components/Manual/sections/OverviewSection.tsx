const OverviewSection = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-700/50 rounded-lg p-6 border border-slate-600">
        <h3 className="text-xl font-semibold text-blue-300 mb-4 flex items-center gap-2">
          <span>📋</span>
          Разделы методички:
        </h3>
        <ul className="space-y-3 text-slate-200">
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Лекции</strong> - Проведение учебных занятий
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Тренировки</strong> - Организация практических занятий
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Мероприятия</strong> - Список основных мероприятий МО
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">РП задания</strong> - Практические применение изученного материала
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Правила проведения экзаменов</strong> - Процедуры проведения экзаменов
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Правила поставки боеприпасов</strong> - Краткое руководство для поставок
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Парковочные места ВЧ</strong> - Список допущенного транспорта на въезд
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Собеседование (Срочная)</strong> - Алгоритмы основных действий при
              проведение призыва
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Собеседование (Контракт)</strong> - Шаблонные действие при приеме граждан
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Шаблоны для Доски Объявлений</strong> - Стандартные отписи в ДО
            </div>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-blue-400 mt-1">•</span>
            <div>
              <strong className="text-white">Работа по форуму</strong> - Краткое описание для работы по форуму
            </div>
          </li>
        </ul>
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
