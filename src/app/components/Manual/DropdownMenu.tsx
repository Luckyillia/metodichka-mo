import React, { useState } from 'react';
import ExamplePhrase from './ExamplePhrase';

interface DropdownMenuProps {
    title: string;
    items: string[] | DropdownMenuProps[]; // Измененный тип для поддержки вложенности
    icon?: string;
    text?: string;
    type?: "0" | "1"; // Конкретизировали тип
    who?: "ms" | "ss";
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ title, items, icon = '📚', text= "", type = "0", who = "ms"}) => {
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
                    {/* Условие для отображения примечания */}
                    {text && (
                        <div className="note">
                            <strong>Примечание:</strong> {text}
                        </div>
                    )}

                    <ul className="dropdown-list">
                        {items.map((item, index) => {
                            // Рендер для типа "1" (вложенные DropdownMenu)
                            if (type === "1") {
                                const nestedProps = item as DropdownMenuProps;
                                return (
                                    <li key={index} className="dropdown-item full-width">
                                        <div className="dropdown-item-container">
                                            <DropdownMenu {...nestedProps} />
                                        </div>
                                        {index < items.length - 1 && (
                                            <div className="dropdown-separator"></div>
                                        )}
                                    </li>
                                );
                            }

                            // Рендер для типа "0" (обычные фразы)
                            return (
                                <li key={index} className="dropdown-item">
                                    <div className="dropdown-item-container">
                                        <ExamplePhrase text={item as string} type={who}/>
                                    </div>
                                    {index < items.length - 1 && (
                                        <div className="dropdown-separator"></div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DropdownMenu;