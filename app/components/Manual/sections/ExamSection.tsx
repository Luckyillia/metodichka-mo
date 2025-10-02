import React from 'react';
import ExamplePhrase from '../ExamplePhrase';

const ExamSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📍 Место проведения</h3>
                <p>Проверка знаний может проводится в любом месте на усмотрение проводящего.</p>
            </div>

            <div className="subsection">
                <h3>❓ Процедура проведения</h3>
                <p>На проверке задаются вопросы в виде номеров пункта и откуда взят пункт. С момент отправки вопроса
                    наблюдается скорость и правильность ответа, также навыки по поиску ответов. Использование форумом не
                    запрещено.</p>
            </div>

            <div className="subsection">
                <h3>📚 Документы для проверки знаний</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>ПСГО</strong> - <a
                        href="https://forum.gtaprovince.ru/topic/203338-pravila-dlya-sotrudnikov-gos-organizaciy/"
                        className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>УМО</strong> - <a href="https://forum.gtaprovince.ru/topic/420468-ustav-mo/"
                                                  className="document-link" target="_blank" rel="noopener noreferrer">Открыть
                        документ</a></li>
                    <li><strong>Правила нахождения на КПП и вблизи воинской части</strong> - <a
                        href="https://forum.gtaprovince.ru/topic/662524-pravila-nahozhdeniya-na-kpp-i-vblizi-voinskoy-chasti/"
                        className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Правила поведения в строю</strong> - <a
                        href="https://forum.gtaprovince.ru/topic/715425-informacionnyy-razdel/?do=findComment&comment=5213454"
                        className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Трудовой этикет</strong> - <a
                        href="https://forum.gtaprovince.ru/topic/715425-informacionnyy-razdel/?do=findComment&comment=5047381"
                        className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Присяга</strong> - <a
                        href="https://forum.gtaprovince.ru/topic/917704-centr-podgotovki-oficerskogo-sostava/"
                        className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                </ul>
            </div>
            <div className="subsection">
                <h3>📚 Проведение экзамена на знание УМО</h3>
                <ExamplePhrase
                    text="say Сейчас пройдет экзамен на знание Уставной Документации Министерства Обороны!" type="ss" />
                <div className="note">
                    <strong>📌 Примечание:</strong> После чего вы задаете от 3 до 6 вопрос по данному разделу
                </div>
                <div className="note">
                    <strong>📌 Примечание:</strong> После примерно 2 вопроса сотрудник должен сделать фотокарточку (скриншот)
                </div>
                <ExamplePhrase
                    text="say Экзамен на знание Уставной Документации Министерства Обороны успешно сдан!" type="ss" />
                <div className="note">
                    <strong>📸 Примечание:</strong> У сотрудника должно быть три фотокарточки (скриншота), о начале,
                    середине и конце экзамена.
                </div>
            </div>

            <div className="subsection">
                <h3>💼 Проведение экзамена на знание Трудового Этикета (биндов)</h3>
                <ExamplePhrase text="say Сейчас пройдет экзамен на знание Трудового Этикета!" type="ss" />
                <div className="note">
                    <strong>📌 Примечание:</strong> После чего вы задаете от 3 до 6 вопрос по данному разделу
                </div>
                <div className="note">
                    <strong>📌 Примечание:</strong> После примерно 2 вопроса сотрудник должен сделать фотокарточку (скриншот)
                </div>
                <ExamplePhrase text="say Экзамен на знание Трудового Этикета успешно сдан!" type="ss"/>
                <div className="note">
                    <strong>📸 Примечание:</strong> У сотрудника должно быть три фотокарточки (скриншота), о начале,
                    середине и конце экзамена.
                </div>
            </div>

            <div className="subsection">
                <h3>🎖️ Правила принятия Присяги</h3>
                <ExamplePhrase text="say Сейчас пройдет сдача присяги Министерства Обороны!" type="ss" />
                <div className="note">
                    <strong>📌 Примечание:</strong>  Первая фотокарточка (скриншот)
                </div>
                <ExamplePhrase text="do На трибуне лежит текст военной присяги.  "/>
                <ExamplePhrase text="me открыл текст и начал читать"/>
                <ExamplePhrase text="say Я, Прапорщик Томас Гуд, торжественно клянусь на верность...  "/>
                <ExamplePhrase text="say своему Отечеству, Республике Провинция.  "/>
                <ExamplePhrase text="say Клянусь свято соблюдать Конституцию Республики Провинция...  "/>
                <ExamplePhrase text="say строго выполнять требования воинских уставов, приказы Командиров и Начальников.  "/>
                <div className="note">
                    <strong>📌 Примечание:</strong>  Вторая фотокарточка (скриншот)
                </div>
                <ExamplePhrase text="say Клянусь достойно исполнять воинский долг, мужественно защищать свободу...  "/>
                <ExamplePhrase text="say независимость и конституционный строй Провинции, народ и Отечество."/>
                <ExamplePhrase text="me закрыл текст военной присяги"/>
                <ExamplePhrase text="do Текст военной присяги закрыт."/>
                <ExamplePhrase text="say На этом сдача присяги Министерства Обороны окончена!" type="ss" />
                <div className="note">
                    <strong>📌 Примечание:</strong>  Третья фотокарточка (скриншот)
                </div>
                <div className="warning">
                    <strong>⚠️ Важные условия присяги:</strong>
                    <ul className="list-disc pl-5 mt-2">
                        <li>Присяга проводится при наличии 3-х + сотрудников в строю</li>
                        <li>Проводящий присяги обязан вызвать из строя сотрудника</li>
                        <li>Поставить его возле себя и попросить зачитать присягу</li>
                        <li>После зачтения присяги вернуть сотрудника в строй</li>
                        <li>У сотрудника должно быть три фотокарточки (скриншота)</li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default ExamSection;
