import React from 'react';
import ExamplePhrase from "@/app/components/Manual/ExamplePhrase";

const LecturesSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>📍 Место проведения</h3>
                <p>Все лекции проводятся непосредственно в учебной классе Казармы.</p>
            </div>
            <div className="subsection">
                <h3>💬 Обязанности военнослужащих </h3>
                <ExamplePhrase text="s Здравия желаю. Сейчас я прочитаю лекцию об обязанностях военнослужащих." />
                <ExamplePhrase text="s Основные обязанности военнослужащих таковы:" />
                <ExamplePhrase text="s Мужественно, смелость, не щадя своей жизни выполнять воинский долг." />
                <ExamplePhrase text="s Стойко переносить трудности военной службы." />
                <ExamplePhrase text="s Быть честным, дисциплинированным, храбрым, при выполнении воинского долга." />
                <ExamplePhrase text="s Соблюдать правила воинской вежливости, поведения и выполнения воинского приветствия." />
                <ExamplePhrase text="s Беспрекословно подчиняться приказам командиров." />
                <ExamplePhrase text="s Честно выполнять порученную боевую или иную задачу. " />
                <ExamplePhrase text="s Знать должности, воинские звания и фамилии своих прямых командиров." />
                <ExamplePhrase text="s С достоинством вести себя в общественных местах не допускать самому и удерживать" />
                <ExamplePhrase text="s других от недостойных поступков, содействовать защите чести и достоинства граждан." />
                <ExamplePhrase text="s Лекция окончена. Спасибо за внимание! " />
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