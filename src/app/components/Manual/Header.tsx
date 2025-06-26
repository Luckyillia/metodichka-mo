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
        <div className="search-container">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Поиск по методичке..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
    </header>
  );
}