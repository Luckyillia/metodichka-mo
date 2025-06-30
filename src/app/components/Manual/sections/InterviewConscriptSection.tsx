import React from 'react';
import ExamplePhrase from '../ExamplePhrase';

const InterviewConscriptSection = () => {
    return (
        <>
            <div className="warning">
                <strong>⚠️ Важно:</strong> Собеседование на срочную или контрактную службу проводятся только заместителями лидера или лидером. Организация контроля порядка и/или оказание помощи на собеседовании допускается с разрешения проводящего собеседования.
            </div>

            <div className="subsection">
                <h3>🏥 График больниц для военно-медицинского осмотра</h3>
                <div className="schedule-grid">
                    <div className="schedule-item">01-07 числа<br/>ЦГБ г. Приволжск</div>
                    <div className="schedule-item">08-15 числа<br/>ОКБ г. Мирный</div>
                    <div className="schedule-item">16-23 числа<br/>ЦГБ г. Невский</div>
                    <div className="schedule-item">24-31 числа<br/>ОКБ г. Мирный</div>
                </div>
            </div>

            <div className="subsection">
                <h3>📋 Этапы собеседования (2 этапа)</h3>

                <div className="note">
                    <h4><strong>I этап - RP проверка</strong></h4>
                    <p><strong>Проверяется:</strong></p>
                    <ul className="list-disc pl-5">
                        <li>Паспорт (/pass) - на наличие необходимого уровня, 3+</li>
                        <li>Трудовая книжка (/tk) - на отсутствие ОЧС</li>
                        <li>Медицинская карта (/medcard) - на наличие её актуальности</li>
                        <li><strong>При необходимости:</strong> запрос в рацию и проверка судимости</li>
                    </ul>
                </div>

                <div className="note">
                    <h4><strong>II этап - NonRP проверка</strong></h4>
                    <p>Состоит из проверки на наличие документов</p>
                </div>
            </div>

            <div className="subsection">
                <h3>💬 Пример проведения собеседования</h3>
                <ExamplePhrase text="say Здравствуйте, Вы на собеседование?" />
                <div className="note">
                    <strong>📌 Примечание:</strong> Ждёте ответ гражданского
                </div>
                <ExamplePhrase text="say Представьтесь, ваше ФИО и возраст." />
                <ExamplePhrase text="say Предоставьте Ваш паспорт." />
                <ExamplePhrase text="say Предоставьте Вашу трудовую книжку." />
                <ExamplePhrase text="say Предоставьте Вашу медицинскую карту." />
                <ExamplePhrase text="say Хорошо, забирайте." />
            </div>

            <div className="note">
                <p><strong>Примечание:</strong> В случае успешного прохождения собеседования, гражданский ожидает окончания призыва и в последующем будет направлен вместе с военнослужащими в медицинское учреждение. В случае если гражданин не прошёл собеседование, ему нужно ожидать следующего призыва.</p>
            </div>
        </>
    );
};

export default InterviewConscriptSection;