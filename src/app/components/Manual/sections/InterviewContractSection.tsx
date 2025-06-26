import React from 'react';
import ExamplePhrase from '../ExamplePhrase';

const InterviewContractSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📋 Этапы собеседования (2 этапа)</h3>

                <div className="note">
                    <h4><strong>I этап - RP проверка</strong></h4>
                    <p><strong>Проверяется:</strong></p>
                    <ul className="list-disc pl-5">
                        <li>Паспорт (/pass) - на наличие необходимого уровня, 3+</li>
                        <li>Военный билет (/vb) - на его наличие</li>
                        <li>Трудовая книжка (/tk) - на отсутствие ОЧС</li>
                        <li>Водительское удостоверение (/lic) - на наличие лицензий</li>
                        <li>Медицинская карта (/medcard) - на наличие её актуальности</li>
                        <li><strong>При необходимости:</strong> запрос в рацию и проверка судимости</li>
                    </ul>
                </div>

                <div className="note">
                    <h4><strong>II этап - NonRP проверка</strong></h4>
                    <p>Состоит из проверки на наличие MetaGaming (MG) информации и реагированию на эту информации. Проверка знаний терминов и основы ВПС.</p>
                </div>
            </div>

            <div className="subsection">
                <h3>💬 Пример проведения собеседования</h3>
                <ExamplePhrase text="say Здравствуйте, Вы на собеседование? (Ждёте ответ гражданского)" />
                <ExamplePhrase text="say Представьтесь, ваше ФИО и возраст" />
                <ExamplePhrase text="say Предоставьте Ваш паспорт." />
                <ExamplePhrase text="say Предоставьте Ваш военный билет." />
                <ExamplePhrase text="say Предоставьте Вашу трудовую книжку." />
                <ExamplePhrase text="say Предоставьте Ваше водительское удостоверение." />
                <ExamplePhrase text="say Предоставьте Вашу медицинскую карту." />
                <ExamplePhrase text="say Хорошо, забирайте." />
            </div>

            <div className="subsection">
                <h3>🧠 Вопросы NonRP проверки</h3>
                <ExamplePhrase text="say Что у меня над головой? (Ответ гражданина в зависимости от местности)" />
                <ExamplePhrase text="say Что такое ДМ, РП, ТК? (Ждёте ответ с выдуманными терминами, НЕ DeadMatch, RolePlay и TransLit)" />
                <ExamplePhrase text="b ДМ РП ТЛ обозначение с расшифровкой (Ждёте ответ в нонРП чат)" />
                <ExamplePhrase text="say Что у меня в руках? (Достаёте оружие без отыгровок)" />
                <ExamplePhrase text="say Как меня зовут? (По шеврону только Фамилия и инициалы)" />
                <ExamplePhrase text="say Присядьте на корточки. (Ждёте когда гражданский сядет)" />
                <ExamplePhrase text="b Вставайте (Персонаж НЕ должен встать)" />
                <ExamplePhrase text="say Вставайте (Гражданский должен встать)" />

                <div className="note">
                    <p><strong>Справочная информация:</strong> <a href="https://info.gtaprovince.ru/aboutMTA/rulestermen" className="document-link" target="_blank" rel="noopener noreferrer">Список RP терминов</a></p>
                </div>
            </div>

            <div className="warning">
                <strong>📝 Важные примечания:</strong>
                <ul className="list-disc pl-5 mt-2">
                    <li>Количество допустимых ошибок на собеседовании равно 3</li>
                    <li>При достижении 3/3 ошибок - RP причина отказа: "Проф. непригодны"</li>
                    <li>Индивидуальное собеседование проводится аналогично открытому</li>
                    <li>Индивидуальные собеседования назначаются заместителями лидера или лидером</li>
                </ul>
            </div>
        </>
    );
};

export default InterviewContractSection;