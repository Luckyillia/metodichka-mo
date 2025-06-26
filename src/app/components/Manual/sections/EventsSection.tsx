import React from 'react';

const EventsSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📍 Места проведения</h3>
                <p>Мероприятия проводятся как на Воинской части, так и за ее пределами.</p>
            </div>

            <div className="subsection">
                <h3>📋 Список основных мероприятий для Министерства Обороны</h3>
                <div className="schedule-grid">
                    <div className="schedule-item">🔧 Сборка/разборка автомата</div>
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