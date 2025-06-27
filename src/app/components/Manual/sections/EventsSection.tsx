import React from 'react';
import DropdownMenu from '../DropdownMenu';

const EventsSection = () => {
    const events = [
        "Парко хозяйственный день (ПХД)",

    ];

    const eventsContent = {
            "Мытье полов": [
                "me открыл шкафчик",
                "me достал из шкафчик швабру и ведро",
                "me закрыл шкафчик",
                "do Шкафчик закрыт.",
                "me поднес ведро к крану",
                "me включил кран",
                "do Ведро наполнилось водой.",
                "me взял ведро в руку",
                "do Тряпка на швабре.",
                "me окунул швабру в ведро воды",
                "me моет пол",
                "do Тряпка сухая.",
                "me окунул швабру в ведро воды",
                "me моет пол",
                "me взял ведро в руку",
                "me вылил грязную воду в унитаз",
                "me ополоснул ведро чистой водой из под крана",
                "me открыл шкафчик",
                "me положил ведро,тряпку и швабру в шкаф",
                "me закрыл шкаф"
            ],
            "Поливка цветов": [
                "me открыл шкаф и достал лейку",
                "do Лейка в руке.",
                "me закрыл шкаф",
                "do Шкаф закрыт.",
                "me открыл кран с водой",
                "me набирает воду",
                "do Лейка наполнена водой.",
                "me поливает архидею",
                "me поливает розу",
                "me поливает фиалку",
                "me поливает алоэ",
                "me открыл шкаф и убрал лейку",
                "me закрыл шкаф",
                "do Шкаф закрыт."
            ],
            "Замена дверной ручки": [
                "do Старая дверная ручка треснута",
                "do Новая ручка в руках..",
                "me достал маленькую отвертку из кармана",
                "me открутил старую дверную ручку",
                "me распечатал новую",
                "me примерил ее на месте старой",
                "do Ручка подошла.",
                "me закрутил новую ручку",
                "me положил отвертку обратно в карман",
                "do Отвертка в кармане",
                "me начал вкручивать новую дверную ручку",
                "do Новая ручка стоит на месте старой."
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
                    <div className="schedule-item">📡 Парко хозяйственный день (ПХД)</div>
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