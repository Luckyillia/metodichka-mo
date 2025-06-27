import React, { useState } from 'react';
import ExamplePhrase from './ExamplePhrase';

interface DropdownMenuProps {
    title: string;
    items: string[];
    icon?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items, icon = '📚' }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown-menu">
            <button
                className="dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="dropdown-toggle-content">
                    <span className="dropdown-toggle-icon">{icon}</span>
                    <span className="dropdown-toggle-title">{title}</span>
                </span>

                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    ▼
                </span>
            </button>

            <div className={`dropdown-content ${isOpen ? 'open' : 'closed'}`}>
                <div className="dropdown-content-container">
                    <div className="dropdown-top-stripe"></div>

                    <ul className="dropdown-list">
                        {items.map((item, index) => (
                            <li key={index} className="dropdown-item">
                                <div className="dropdown-item-container">
                                    <div className="dropdown-item-indicator"></div>

                                    <div className="dropdown-item-content">
                                        <ExamplePhrase text={item} />

                                        <span className="dropdown-item-arrow">
                                            →
                                        </span>
                                    </div>

                                    <div className="dropdown-item-highlight"></div>
                                </div>

                                {index < items.length - 1 && (
                                    <div className="dropdown-separator"></div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DropdownMenu;