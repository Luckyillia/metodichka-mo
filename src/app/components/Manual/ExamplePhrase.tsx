import React, { useState } from 'react';
import '@/app/styles/examplePhrase.css';

interface ExamplePhraseProps {
    text: string;
    type?: "ms" | "ss";
}

const ExamplePhrase: React.FC<ExamplePhraseProps> = ({ text, type = "ms" }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div
            className={`example-phrase ${type}-phrase`}
            onClick={copyToClipboard}
        >
            {text}
            <button className={`copy-btn ${copied ? 'copied' : ''}`}>
                {copied ? '✅ Скопировано!' : '📋 Копировать'}
            </button>
        </div>
    );
};

export default ExamplePhrase;