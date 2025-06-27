import React from 'react';
import DropdownMenu from '../DropdownMenu';

const TrainingSection = () => {
    const training = [
        "Тренировка 1: Отжимание",
        "Тренировка 2: Приседания",
        "Тренировка 3: Челночный бег",
    ];

    const trainingContent = {
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
                <h3>🏟️ Места проведения тренировок</h3>
                <p>Все тренировки в основном проходят на территории воинской части:</p>
            </div>
            <div className="subsection">
                <h3>📚 Доступные тренеровки</h3>

                <div className="space-y-3 mt-4">
                    {training.map((lecture, index) => (
                        <DropdownMenu
                            key={index}
                            title={lecture}
                            icon="📖"
                            items={trainingContent[lecture as keyof typeof trainingContent] || ["Содержание лекции будет добавлено позже"]}
                        />
                    ))}
                </div>
            </div>
            <div className="subsection">
                <h3>📂 Материалы для тренировок</h3>
                <p>Файл с тренировками: <a
                    href="https://docs.google.com/document/d/1RZ9_iGUavo-IC1WNr-APZVf8VRrrG7sI-wT5xzEKbps/edit?tab=t.0"
                    className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></p>
            </div>
        </>
    );
};

export default TrainingSection;