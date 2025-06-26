import React from 'react';
import ExamplePhrase from '../ExamplePhrase';

const ForumResponsesSection = () => {
    return (
        <>
            <div className="subsection">
                <h3>👤 Принятие во фракцию</h3>
                <ExamplePhrase text="Одобрено! С вами скоро свяжутся.
С уважением, Начальник Генерального Штаба, Гутков Данил Анатольевич." />
            </div>

            {/* Остальные шаблоны ответов аналогично */}
        </>
    );
};

export default ForumResponsesSection;