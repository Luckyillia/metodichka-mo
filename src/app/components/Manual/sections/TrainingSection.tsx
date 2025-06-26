import React from 'react';
import ExamplePhrase from '../ExamplePhrase';

const TrainingSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>🏟️ Места проведения тренировок</h3>
                <p>Все тренировки в основном проходят на территории воинской части:</p>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>На плацу</strong> - Строевая подготовка</li>
                    <li><strong>Полоса препятствий</strong> - Физическая подготовка</li>
                    <li><strong>Стрелковый полигон</strong> - Огневая подготовка</li>
                </ul>
            </div>

            <div className="subsection">
                <h3>📂 Материалы для тренировок</h3>
                <p>Файл с тренировками: <a href="https://docs.google.com/document/d/1RZ9_iGUavo-IC1WNr-APZVf8VRrrG7sI-wT5xzEKbps/edit?tab=t.0" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></p>
            </div>
        </>
    );
};

export default TrainingSection;