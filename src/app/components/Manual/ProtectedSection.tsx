import React, { useState, useEffect } from 'react';
import '@/app/styles/protectedSection.css';

interface ProtectedSectionProps {
    children: React.ReactNode;
    password: string;
    hint?: string;
    sessionDuration?: number; // в минутах, по умолчанию 5
}

const ProtectedSection: React.FC<ProtectedSectionProps> = ({
                                                               children,
                                                               password,
                                                               hint = "Подсказка не предоставлена",
                                                               sessionDuration = 5
                                                           }) => {
    const [accessGranted, setAccessGranted] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [error, setError] = useState('');
    const [showHint, setShowHint] = useState(false);
    const [attempts, setAttempts] = useState(3);
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockTimeLeft, setBlockTimeLeft] = useState(0);
    const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

    // Генерируем уникальный ключ для этого компонента на основе пароля
    const sessionKey = `protected_section_${btoa(password).substring(0, 10)}`;

    // Проверяем сессию при монтировании компонента
    useEffect(() => {
        const savedSession = sessionStorage.getItem(sessionKey);
        if (savedSession) {
            const sessionData = JSON.parse(savedSession);
            const now = Date.now();

            if (now < sessionData.expiresAt) {
                setAccessGranted(true);
                const timeLeft = Math.floor((sessionData.expiresAt - now) / 1000);
                setSessionTimeLeft(timeLeft);
            } else {
                // Сессия истекла, удаляем её
                sessionStorage.removeItem(sessionKey);
            }
        }
    }, [sessionKey]);

    // Обработка блокировки
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

    // Обработка сессии
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (accessGranted && sessionTimeLeft > 0) {
            interval = setInterval(() => {
                setSessionTimeLeft(prev => {
                    if (prev <= 1) {
                        // Сессия истекла
                        setAccessGranted(false);
                        sessionStorage.removeItem(sessionKey);
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
    }, [accessGranted, sessionTimeLeft, sessionKey]);

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

            // Сохраняем сессию
            const expiresAt = Date.now() + (sessionDuration * 60 * 1000);
            const sessionData = {
                expiresAt,
                grantedAt: Date.now()
            };

            sessionStorage.setItem(sessionKey, JSON.stringify(sessionData));
            setSessionTimeLeft(sessionDuration * 60);
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

    const handleLogout = () => {
        setAccessGranted(false);
        setSessionTimeLeft(0);
        sessionStorage.removeItem(sessionKey);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Если доступ получен, показываем защищенный контент
    if (accessGranted) {
        return (
            <div>
                <div className="session-indicator">
                    <span>🔓 Сессия: {formatTime(sessionTimeLeft)}</span>
                    <button
                        onClick={handleLogout}
                        className="session-logout-button"
                    >
                        Выйти
                    </button>
                </div>
                {children}
            </div>
        );
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
                    <p className="session-duration-info">
                        После успешного входа доступ будет сохранен на {sessionDuration} мин.
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
                        <div className="attempts-counter">
                            Осталось попыток: {attempts}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProtectedSection;