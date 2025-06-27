import React, { useState } from 'react';
import ExamplePhrase from './ExamplePhrase';

interface DropdownMenuProps {
    title: string;
    items: string[];
    icon?: string;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items, icon = '📚', text= ""}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="dropdown-menu">
            <button
                className="dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="dropdown-toggle-content">
                    <span className="dropdown-toggle-icon">{icon}</span>
                    <span>{title}</span>
                </span>

                <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
                    ▼
                </span>
            </button>

            <div className={`dropdown-content ${isOpen ? 'open' : 'closed'}`}>
                <div className="dropdown-content-container">
                    <div className="note">
                        <strong>Примечание:</strong> {text}
                    </div>
                    <ul className="dropdown-list">
                        {items.map((item, index) => (
                            <li key={index} className="dropdown-item">
                                <div className="dropdown-item-container">
                                    <ExamplePhrase text={item} />
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