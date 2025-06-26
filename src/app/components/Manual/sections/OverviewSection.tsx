import React from 'react';

const OverviewSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📋 Хуета:</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>Лекции</strong> - Проведение учебных занятий</li>
                    <li><strong>Тренировки</strong> - Организация практических занятий</li>
                    <li><strong>Мероприятия</strong> - Список основных мероприятий МО</li>
                    <li><strong>Правила экзаменов</strong> - Процедуры проведения экзаменов</li>
                    <li><strong>Принятие экзаменов</strong> - Практические аспекты приема экзаменов</li>
                    <li><strong>Собеседования</strong> - Процедуры для срочной и контрактной службы</li>
                    <li><strong>График неактивов</strong> - Распределение ответственности</li>
                    <li><strong>Процедуры работы</strong> - Алгоритмы основных действий</li>
                    <li><strong>Доска объявлений</strong> - Шаблоны объявлений</li>
                    <li><strong>Форумные процедуры</strong> - Правила работы с форумом</li>
                </ul>
            </div>

            <div className="note">
                <strong>💡 Важно:</strong> Данная методичка содержит все необходимые инструкции для работы старшего состава. Используйте навигацию слева для быстрого перехода к нужному разделу.
            </div>
        </>
    );
};

export default OverviewSection;