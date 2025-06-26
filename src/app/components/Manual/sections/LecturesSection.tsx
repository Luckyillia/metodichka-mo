import React from 'react';

const LecturesSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📍 Место проведения</h3>
                <p>Все лекции проводятся непосредственно в учебной классе Казармы.</p>
            </div>

            <div className="subsection">
                <h3>📂 Материалы для лекций</h3>
                <p>Файл с лекциями: <a href="https://docs.google.com/document/d/11SDBGIy4Jn66JpitEV0-D2-uBdqRIopJe3IuaeAHmr8/edit?tab=t.0" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></p>
            </div>

            <div className="note">
                <strong>📌 Примечание:</strong> Убедитесь, что у вас есть доступ к документу с лекциями перед началом занятий.
            </div>
        </>
    );
};

export default LecturesSection;