import React, { useState } from 'react';

interface ExamplePhraseProps {
  text: string;
}

const ExamplePhrase: React.FC<ExamplePhraseProps> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
      <div className="example-phrase" onClick={copyToClipboard}>
        {text}
        <button className={`copy-btn ${copied ? '!bg-green-500' : ''}`}>
          {copied ? '✅ Скопировано!' : '📋 Копировать'}
        </button>
      </div>
  );
};

export default ExamplePhrase;