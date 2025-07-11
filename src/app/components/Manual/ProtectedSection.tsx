import React, { useState, useEffect } from 'react';
import '@/app/styles/protectedSection.css';

interface ProtectedSectionProps {
    children: React.ReactNode;
    password: string;
    hint?: string;
}

const ProtectedSection: React.FC<ProtectedSectionProps> = ({
                                                               children,
                                                               password,
                                                               hint = "Подсказка не предоставлена"
                                                           }) => {
    const [accessGranted, setAccessGranted] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(3);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeLeft, setBlockTimeLeft] = useState(0);

    // Исправление: убираем localStorage, используем состояние компонента
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isBlocked && blockTimeLeft > 0) {
            interval = setInterval(() => {
                setBlockTimeLeft(prev => {
                    if (prev <= 1) {
                        setIsBlocked(false);
                        setAttempts(3);
                        setError('');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isBlocked, blockTimeLeft]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Проверяем, не заблокирован ли доступ
        if (isBlocked) {
            return;
        }

        if (inputPassword.trim() === password) {
            setAccessGranted(true);
            setError('');
            setInputPassword('');
        } else {
            const newAttempts = attempts - 1;
            setAttempts(newAttempts);

            if (newAttempts <= 0) {
                setIsBlocked(true);
                setBlockTimeLeft(30); // 30 секунд блокировки
                setError('Доступ заблокирован! Попробуйте позже.');
                setInputPassword('');
            } else {
                setError(`Неверный пароль! Осталось попыток: ${newAttempts}`);
                setInputPassword('');
            }
        }
    };

    // Если доступ получен, показываем защищенный контент
    if (accessGranted) {
        return <>{children}</>;
    }

    return (
        <div className="protected-section">
            <div className="protected-container">
                <div className="protected-header">
                    <div className="protected-icon">🔒</div>
                    <h3 className="protected-title">Доступ ограничен</h3>
                    <p className="protected-description">
                        Этот раздел защищен паролем. Введите пароль для доступа.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="protected-form">
                    <div className="input-container">
                        <input
                            type="password"
                            value={inputPassword}
                            onChange={(e) => setInputPassword(e.target.value)}
                            placeholder="Введите пароль"
                            className="protected-input"
                            disabled={isBlocked}
                            required
                        />
                    </div>

                    {error && (
                        <div className="error-message">
                            {isBlocked && blockTimeLeft > 0
                                ? `Доступ заблокирован! Попробуйте через ${blockTimeLeft} сек.`
                                : error
                            }
                        </div>
                    )}

                    <div className="form-controls">
                        <button
                            type="button"
                            className="hint-button"
                            onClick={() => setShowHint(!showHint)}
                            disabled={isBlocked}
                        >
                            <span className="hint-icon">ℹ️</span>
                            {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
                        </button>

                        <button
                            type="submit"
                            className="submit-button"
                            disabled={isBlocked || !inputPassword.trim()}
                        >
                            {isBlocked ? 'Заблокировано' : 'Получить доступ'}
                        </button>
                    </div>

                    {showHint && (
                        <div className="hint-container">
                            <p className="hint-text">
                                <span className="hint-icon">💡</span>
                                Подсказка: {hint}
                            </p>
                        </div>
                    )}

                    {!isBlocked && attempts < 3 && (
                        <div style={{
                            textAlign: 'center',
                            color: 'rgba(255, 255, 255, 0.8)',
                            fontSize: '0.9rem'
                        }}>
                            Осталось попыток: {attempts}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProtectedSection;