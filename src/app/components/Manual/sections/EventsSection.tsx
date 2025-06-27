import React from 'react';
import DropdownMenu from '../DropdownMenu';

const EventsSection = () => {
    const lectures = [
        "Тренировка 1: Отжимание",
        "Тренировка 2: Приседания",
        "Тренировка 3: Челночный бег",
    ];

    const lectureContent = {
        "Тренировка 1: Отжимание": [
            "say Сейчас пройдет тренировка \"Отжимания\"!",
            "say Упор лежа принять!",
            "say 30 раз под свой счет.",
            "s Начали!",
            "s Закончили!",
            "say Тренировка \"Отжимания\" закончена!",
        ],
        "Тренировка 2: Приседания": [
            "say Сейчас пройдет тренировка \"Приседания\"!.",
            "say 30 раз под свой счет.",
            "s Начали!",
            "s Закончили!",
            "say Тренировка \"Приседания\" закончена!",
        ],
        "Тренировка 3: Челночный бег": [
            "say бежим 3 раза!",
            "s Начали!.",
            "s Закончили!",
            "say Тренировка \"Челночный бег\" закончена!",
        ],
    };
    return (
        <>
            <div className="subsection">
                <h3>📍 Места проведения</h3>
                <p>Мероприятия проводятся как на Воинской части, так и за ее пределами.</p>
            </div>

            <div className="subsection">
                <h3>📋 Список основных мероприятий для Министерства Обороны</h3>
                <div className="schedule-grid">
                    <div className="schedule-item"><a href="https://github.com/Luckyillia/metodichka-mo" className="document-link" target="_blank" rel="noopener noreferrer">🔧 Сборка/разборка автомата</a> </div>
                    <div className="schedule-item">🔫 Сборка/разборка пистолета</div>
                    <div className="schedule-item">💣 Разминирование мины</div>
                    <div className="schedule-item">📻 Починка рации</div>
                    <div className="schedule-item">💻 Установка антивируса</div>
                    <div className="schedule-item">📡 Проверка радиоаппаратуры</div>
                    <div className="schedule-item">🧽 Мытье полов</div>
                    <div className="schedule-item">🌸 Поливка цветов</div>
                    <div className="schedule-item">🚪 Замена дверной ручки</div>
                </div>
            </div>

            <div className="subsection">
                <h3>📂 Материалы для мероприятий</h3>
                <p>Файл с мероприятиями: <a href="https://docs.google.com/document/d/1S3epu7BGhAccD75Y8nWu3Y1j4Dd30BNO14o8ATKlnfY/edit?tab=t.0" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></p>
            </div>
        </>
    );
};

export default EventsSection;