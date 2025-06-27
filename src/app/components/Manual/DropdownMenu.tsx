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
        <div className="dropdown-menu mb-4">
            <button
                className="dropdown-toggle w-full text-left p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-between"
                onClick={() => setIsOpen(!isOpen)}
            >
        <span>
          {icon} {title}
        </span>
                <span className="transform transition-transform duration-300">
          {isOpen ? '▲' : '▼'}
        </span>
            </button>

            {isOpen && (
                <div className="dropdown-content mt-2 bg-white rounded-lg shadow-lg p-4">
                    <ul className="space-y-2">
                        {items.map((item, index) => (
                            <li key={index} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded">
                                <span className="flex-grow">{item}</span>
                                <ExamplePhrase text={item} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;