import React from 'react';
import ExamplePhrase from '../ExamplePhrase';

const ExamRulesSection = () => {
    return (
        <>
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

export default ExamRulesSection;