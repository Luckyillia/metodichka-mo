import { useState } from 'react';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <span>🎖️</span>
          Методичка для Старшего Состава
        </div>
      </div>
    </header>
  );
}