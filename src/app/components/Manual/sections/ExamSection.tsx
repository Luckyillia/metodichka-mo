import React from 'react';

const ExamSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📍 Место проведения</h3>
                <p>Проверка знаний может проводится в любом месте на усмотрение проводящего.</p>
            </div>

            <div className="subsection">
                <h3>❓ Процедура проведения</h3>
                <p>На проверке задаются вопросы в виде номеров пункта и откуда взят пункт. С момент отправки вопроса наблюдается скорость и правильность ответа, также навыки по поиску ответов. Использование форумом не запрещено.</p>
            </div>

            <div className="subsection">
                <h3>📚 Документы для проверки знаний</h3>
                <ul className="list-disc pl-5 space-y-2">
                    <li><strong>ПСГО</strong> - <a href="https://forum.gtaprovince.ru/topic/203338-pravila-dlya-sotrudnikov-gos-organizaciy/" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>УМО</strong> - <a href="https://forum.gtaprovince.ru/topic/420468-ustav-mo/" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Правила нахождения на КПП и вблизи воинской части</strong> - <a href="https://forum.gtaprovince.ru/topic/662524-pravila-nahozhdeniya-na-kpp-i-vblizi-voinskoy-chasti/" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Правила поведения в строю</strong> - <a href="https://forum.gtaprovince.ru/topic/715425-informacionnyy-razdel/?do=findComment&comment=5213454" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Трудовой этикет</strong> - <a href="https://forum.gtaprovince.ru/topic/715425-informacionnyy-razdel/?do=findComment&comment=5047381" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                    <li><strong>Присяга</strong> - <a href="https://forum.gtaprovince.ru/topic/917704-centr-podgotovki-oficerskogo-sostava/" className="document-link" target="_blank" rel="noopener noreferrer">Открыть документ</a></li>
                </ul>
            </div>
            <div className="subsection">
                <h3>📚 При проверке УМО</h3>
                <ExamplePhrase text="Начало: say Сейчас пройдет экзамен на знание Уставной Документации Министерства Обороны!" />
                <ExamplePhrase text="Конец: say Экзамен на знание Уставной Документации Министерства Обороны успешно сдан!" />
                <div className="note">
                    <strong>📸 Примечание:</strong> У сотрудника должно быть три фотокарточки (скриншота), о начале, середине и конце экзамена.
                </div>
            </div>

            <div className="subsection">
                <h3>💼 При проверке Трудового Этикета</h3>
                <ExamplePhrase text="Начало: say Сейчас пройдет экзамен на знание Трудового Этикета!" />
                <ExamplePhrase text="Конец: say Экзамен на знание Трудового Этикета успешно сдан!" />
                <div className="note">
                    <strong>📸 Примечание:</strong> У сотрудника должно быть три фотокарточки (скриншота), о начале, середине и конце экзамена.
                </div>
            </div>

            <div className="subsection">
                <h3>🎖️ При принятии Присяги</h3>
                <ExamplePhrase text="Начало: say Сейчас пройдет сдача присяги Министерства Обороны!" />
                <ExamplePhrase text="Конец: say На этом сдача присяги Министерства Обороны окончена!" />
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