import React, { useState } from 'react';
import ExamplePhrase from '../ExamplePhrase';
import ProtectedSection from "@/app/components/Manual/ProtectedSection";
import "@/app/styles/gossWave.css";

const GossWaveSection = () => {
    // Состояния для выбора параметров
    const [selectedCity, setSelectedCity] = useState('Мирный');
    const [selectedHour, setSelectedHour] = useState('23');
    const [selectedMinute, setSelectedMinute] = useState('00');

    // Генерация фраз с учетом выбранных параметров
    const generateContractPhrases = () => {
        return [
            `gov Уважаемые жители Республики Провинция, сегодня в ${selectedHour}:${selectedMinute} пройдет собеседование на контрактную службу в Армии Республики Провинция.`,
            `gov Требования: Опрятный внешний вид, 3-ёх летняя прописка, паспорт, медицинская карта и военный билет.`,
            `gov Ждем всех желающих в это время в мэрии города ${selectedCity}!`,

            `gov Уважаемые жители Провинции, собеседование на контрактную службу в Армии Республики Провинция начато!`,
            `gov Вам требуется: иметь опрятный внешний вид, прописку от 3-ёх лет, иметь при себе медицинскую карточку и военный билет!`,
            `gov Встречаемся в Мэрии города ${selectedCity}. Мы ждем всех желающих!`,

            `gov Уважаемые жители Провинции, собеседование на контрактную службу в Армии Республики Провинция продолжается!`,
            `gov Вам требуется: иметь опрятный внешний вид, прописку от 3-ёх лет, иметь при себе медицинскую карточку и военный билет!`,
            `gov Встречаемся в Мэрии города ${selectedCity}. Мы ждем именно Вас!`,

            `gov Уважаемые жители Провинции, собеседование на контрактную службу в Армии Республики Провинция закончено!`,
            `gov Если Вы не успели попасть на собеседование - на гос.портале всегда открыты электронные заявления!`,
            `gov Спасибо за внимание!`
        ];
    };

    const generateConscriptPhrases = () => {
        return [
            `gov Уважаемые жители Республики Провинция, сегодня в ${selectedHour}:${selectedMinute} состоится призыв на срочную службу в ряды Министерства обороны.`,
            `gov Требования: Опрятный внешний вид, 3-ёх летняя прописка, паспорт, медкарта и повестка.`,
            `gov Ждем всех желающих в это время у военкомата г. ${selectedCity}!`,

            `gov Уважаемые жители Республики Провинция, прошу минуточку внимания! Призыв на срочную службу в ряды Министерства обороны открыт.`,
            `gov Вам необходимо прожить минимум 3 года в Республике, иметь опрятный внешний вид, медкарту, паспорт и повестку.`,
            `gov Ждём всех граждан, желающих вступить на службу, у военкомата г.${selectedCity}!`,

            `gov Уважаемые жители Республики Провинция, напоминаем, что призыв на срочную службу в Министерство обороны проходит прямо сейчас.`,
            `gov Вам необходимо прожить минимум 3 года в Республике, иметь опрятный внешний вид, медкарту, паспорт и повестку.`,
            `gov Ждём всех граждан, желающих вступить на службу, у военкомата г.${selectedCity}!`,

            `gov Уважаемые жители Республики Провинция, минуточку внимания!`,
            `gov Призыв на срочную службу в Министерство обороны окончен.`,
            `gov Если не успели явиться - ожидайте следующего призыва.`
        ];
    };

    return (
        <>
            <ProtectedSection
                password="M0o9_25"
                hint="А вот тебе сюда нельзя.............. Так же здесь моглабы быть ваша реклама)"
                sessionDuration={9999}
            >
                {/* Панель выбора параметров */}
                <div className="controls-panel">
                    <h3 className="controls-panel__title">Настройки объявлений</h3>
                    <div className="controls-grid">
                        <div className="control-group control-group--highlight">
                            <label className="control-label">
                                Город проведения
                            </label>
                            <select
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                className="control-select"
                            >
                                <option value="Невский">Невский</option>
                                <option value="Мирный">Мирный</option>
                                <option value="Приволжск">Приволжск</option>
                            </select>
                        </div>
                        <div className="control-group control-group--highlight">
                            <label className="control-label">
                                Часы
                            </label>
                            <select
                                value={selectedHour}
                                onChange={(e) => setSelectedHour(e.target.value)}
                                className="control-select"
                            >
                                {Array.from({length: 24}, (_, i) =>
                                    <option key={i} value={i.toString().padStart(2, '0')}>
                                        {i.toString().padStart(2, '0')}
                                    </option>
                                )}
                            </select>
                        </div>
                        <div className="control-group control-group--highlight">
                            <label className="control-label">
                                Минуты
                            </label>
                            <select
                                value={selectedMinute}
                                onChange={(e) => setSelectedMinute(e.target.value)}
                                className="control-select"
                            >
                                <option value="00">00</option>
                                <option value="30">30</option>
                            </select>
                        </div>
                    </div>
                    <div className="controls-info">
                        <p className="controls-info__text">
                            Выбранные параметры: {selectedCity} в {selectedHour}:{selectedMinute}
                        </p>
                    </div>
                </div>

                <div className="warning mb-4">
                    <strong>⚠️ Важно:</strong> Перед отправкой сообщения проверьте время и место проведения
                </div>

                <div className="subsection mb-8">
                    <h3 className="text-xl font-semibold mb-4">👤 Примеры объявлений для Контрактной Службы</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Объявления перед собеседованием (3 раза):</h4>
                            {generateContractPhrases().slice(0, 3).map((text, index) => (
                                <ExamplePhrase key={`contract-pre-${index}`} text={text} type="ss" />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Во время собеседования (1 раз):</h4>
                            {generateContractPhrases().slice(3, 6).map((text, index) => (
                                <ExamplePhrase key={`contract-during-${index}`} text={text} type="ss" />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Напоминание (2 раза):</h4>
                            {generateContractPhrases().slice(6, 9).map((text, index) => (
                                <ExamplePhrase key={`contract-reminder-${index}`} text={text} type="ss" />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Завершение (1 раз):</h4>
                            {generateContractPhrases().slice(9).map((text, index) => (
                                <ExamplePhrase key={`contract-end-${index}`} text={text} type="ss" />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="subsection">
                    <h3 className="text-xl font-semibold mb-4">👤 Примеры объявлений для Срочной Службы</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium mb-2">Объявления перед призывом (3 раза):</h4>
                            {generateConscriptPhrases().slice(0, 3).map((text, index) => (
                                <ExamplePhrase key={`conscript-pre-${index}`} text={text} type="ss" />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Объявление об открытии (1 раз):</h4>
                            {generateConscriptPhrases().slice(3, 6).map((text, index) => (
                                <ExamplePhrase key={`conscript-open-${index}`} text={text} type="ss" />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Напоминание (2 раза):</h4>
                            {generateConscriptPhrases().slice(6, 9).map((text, index) => (
                                <ExamplePhrase key={`conscript-reminder-${index}`} text={text} type="ss" />
                            ))}
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Завершение (1 раз):</h4>
                            {generateConscriptPhrases().slice(9).map((text, index) => (
                                <ExamplePhrase key={`conscript-end-${index}`} text={text} type="ss" />
                            ))}
                        </div>
                    </div>
                </div>
            </ProtectedSection>
        </>
    );
};

export default GossWaveSection;