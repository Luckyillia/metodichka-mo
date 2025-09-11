import React, { useState, useEffect } from 'react';
import ExamplePhrase from '../ExamplePhrase';
import ProtectedSection from "../ProtectedSection";
import "@/app/styles/reportGenerator.css";

const ReportGenerator = () => {
    const [position, setPosition] = useState('Начальник Гарнизона');
    const [fullName, setFullName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [onlineHours, setOnlineHours] = useState(21);
    const [isVrio, setIsVrio] = useState(false);
    const [signature, setSignature] = useState('');

    // Данные для различных должностей
    const [interviews, setInterviews] = useState([{ date: '', type: '', link: '' }]);
    const [events, setEvents] = useState([{ date: '', name: '', link: '' }]);
    const [lectures, setLectures] = useState([{ date: '', name: '', link: '' }]);
    const [drills, setDrills] = useState([{ date: '', name: '', link: '' }]);
    const [trainings, setTrainings] = useState([{ date: '', name: '', link: '' }]);
    const [shootings, setShootings] = useState([{ date: '', name: '', link: '' }]);
    const [exercises, setExercises] = useState([{ date: '', name: '', link: '' }]);
    const [attendanceType, setAttendanceType] = useState('leader'); // 'leader' or 'grp'
    const [attendanceLink, setAttendanceLink] = useState('');

    // Специфичные данные для разных должностей
    const [contractStats, setContractStats] = useState({ arrived: 0, left: 0, current: 0 });
    const [conscriptStats, setConscriptStats] = useState({ current: 0 });
    const [penalties, setPenalties] = useState({ contract: 0, conscript: 0 });
    const [divisionStats, setDivisionStats] = useState({ left: 0, arrived: 0, current: 0 });

    // Видимые разделы в зависимости от должности
    const visibleSections = {
        'Начальник Гарнизона': ['interviews', 'events', 'lectures', 'drills', 'exercises', 'shootings', 'attendance'],
        'Начальник Штаба': ['interviews', 'events', 'lectures', 'drills', 'exercises', 'attendance'],
        'Начальник Штаба Гражданской Обороны': ['interviews', 'events', 'lectures', 'drills', 'exercises', 'attendance'],
        'Начальник по Военной Профессиональной Подготовке': ['interviews', 'events', 'lectures', 'drills', 'trainings', 'exercises', 'attendance'],
        'Командир Подразделения': ['interviews', 'events', 'lectures', 'drills', 'trainings', 'exercises', 'shootings', 'attendance'],
        'Заместитель Командира Подразделения': ['interviews', 'events', 'lectures', 'trainings', 'attendance'],
    };

    // Генерация дат по умолчанию (текущая неделя)
    useEffect(() => {
        const today = new Date();
        const start = new Date(today);
        start.setDate(today.getDate() - today.getDay()); // Воскресенье предыдущей недели
        const end = new Date(today);
        end.setDate(today.getDate() + (6 - today.getDay())); // Суббота текущей недели

        setStartDate(formatDate(start));
        setEndDate(formatDate(end));
    }, []);

    const formatDate = (date) => {
        return date.toLocaleDateString('ru-RU');
    };

    const handleAddItem = (setter, currentItems, template) => {
        setter([...currentItems, template]);
    };

    const handleRemoveItem = (setter, currentItems, index) => {
        if (currentItems.length === 1) return;
        const newItems = [...currentItems];
        newItems.splice(index, 1);
        setter(newItems);
    };

    const handleItemChange = (setter, currentItems, index, field, value) => {
        const newItems = [...currentItems];
        newItems[index][field] = value;
        setter(newItems);
    };

    const generateReport = () => {
        const vrioPrefix = isVrio ? 'ВрИО ' : '';
        let report = `Маршалу Республики Провинция\n`;
        report += `Начальнику Генерального Штаба\n`;
        report += `Гуду К.И.\n`;
        report += `От "${vrioPrefix}${position}" "${fullName}"\n\n`;

        report += `Я, "${vrioPrefix}${position}", "${fullName}", докладываю о состоянии несения службы и выполненной мной работе за промежуток времени с ${startDate} по ${endDate}. За данный промежуток времени мною был выполнен следующий объём работ:\n\n`;

        report += `Отработано часов в онлайн: ${onlineHours}\n\n`;

        // Собеседования
        if (interviews.length > 0 && interviews[0].date) {
            report += `Собеседования:\n`;
            interviews.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date}, тип: ${item.type || 'не указано'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Мероприятия
        if (events.length > 0 && events[0].date) {
            report += `Мероприятия:\n`;
            events.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date}, количество: 1 - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Лекции
        if (lectures.length > 0 && lectures[0].date) {
            report += `Лекции:\n`;
            lectures.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date}, количество: 1 - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Дополнительные поля в зависимости от должности
        if (position === 'Начальник Гарнизона') {
            report += `Количество военнослужащих контрактной службы:\n`;
            report += `Прибыло: ${contractStats.arrived}, уволилось: ${contractStats.left}\n`;
            report += `Текущее количество: ${contractStats.current}\n\n`;
        }

        if (position === 'Начальник по Военной Профессиональной Подготовке') {
            report += `Количество военнослужащих срочной службы: ${conscriptStats.current}\n\n`;
        }

        if (position === 'Начальник Штаба') {
            report += `Выданные наказания:\n`;
            report += `Контрактная служба: ${penalties.contract}\n`;
            report += `Срочная служба: ${penalties.conscript}\n\n`;
        }

        if (position.includes('Командир') || position.includes('Заместитель')) {
            report += `Статистика подразделения:\n`;
            report += `Ушло: ${divisionStats.left}, прибыло: ${divisionStats.arrived}, текущее количество: ${divisionStats.current}\n\n`;
        }

        // Строевая подготовка
        if (drills.length > 0 && drills[0].date) {
            report += `Строевая подготовка:\n`;
            drills.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Учения
        if (exercises.length > 0 && exercises[0].date) {
            report += `Учения:\n`;
            exercises.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Учебные стрельбы
        if (shootings.length > 0 && shootings[0].date) {
            report += `Учебные стрельбы:\n`;
            shootings.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Тренировки
        if (trainings.length > 0 && trainings[0].date) {
            report += `Тренировки:\n`;
            trainings.forEach(item => {
                if (item.date) {
                    report += `Дата: ${item.date} - ${item.name || 'Название'} - ${item.link || 'ссылка отсутствует'}\n`;
                }
            });
            report += `\n`;
        }

        // Посещение мероприятий (теперь объединено: или у лидера, или на ГРП)
        if (attendanceLink) {
            if (attendanceType === 'leader') {
                report += `Присутствие на качественном мероприятии от лидера: ${attendanceLink || 'не указано'}\n\n`;
            } else if (attendanceType === 'grp') {
                report += `Присутствие на ГРП: ${attendanceLink || 'не указано'}\n\n`;
            }
        }

        report += `Дата: ${new Date().toLocaleDateString('ru-RU')}\n`;
        report += `Подпись: ${signature || fullName}\n`;

        return report;
    };

    const renderPositionSpecificFields = () => {
        switch(position) {
            case 'Начальник Гарнизона':
                return (
                    <div className="subsection">
                        <h3>Статистика контрактной службы</h3>
                        <div className="input-group">
                            <label>Прибыло военнослужащих:</label>
                            <input
                                type="number"
                                value={contractStats.arrived}
                                onChange={(e) => setContractStats({...contractStats, arrived: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Уволилось военнослужащих:</label>
                            <input
                                type="number"
                                value={contractStats.left}
                                onChange={(e) => setContractStats({...contractStats, left: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Текущее количество:</label>
                            <input
                                type="number"
                                value={contractStats.current}
                                onChange={(e) => setContractStats({...contractStats, current: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            case 'Начальник Штаба':
                return (
                    <div className="subsection">
                        <h3>Выданные наказания</h3>
                        <div className="input-group">
                            <label>Контрактная служба:</label>
                            <input
                                type="number"
                                value={penalties.contract}
                                onChange={(e) => setPenalties({...penalties, contract: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Срочная служба:</label>
                            <input
                                type="number"
                                value={penalties.conscript}
                                onChange={(e) => setPenalties({...penalties, conscript: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            case 'Начальник по Военной Профессиональной Подготовке':
                return (
                    <div className="subsection">
                        <h3>Статистика срочной службы</h3>
                        <div className="input-group">
                            <label>Текущее количество:</label>
                            <input
                                type="number"
                                value={conscriptStats.current}
                                onChange={(e) => setConscriptStats({...conscriptStats, current: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            case 'Командир Подразделения':
            case 'Заместитель Командира Подразделения':
                return (
                    <div className="subsection">
                        <h3>Статистика подразделения</h3>
                        <div className="input-group">
                            <label>Ушло (ОЧС, ПСЖ, Перевод):</label>
                            <input
                                type="number"
                                value={divisionStats.left}
                                onChange={(e) => setDivisionStats({...divisionStats, left: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Пришло:</label>
                            <input
                                type="number"
                                value={divisionStats.arrived}
                                onChange={(e) => setDivisionStats({...divisionStats, arrived: parseInt(e.target.value) || 0})}
                            />
                        </div>
                        <div className="input-group">
                            <label>Текущее количество:</label>
                            <input
                                type="number"
                                value={divisionStats.current}
                                onChange={(e) => setDivisionStats({...divisionStats, current: parseInt(e.target.value) || 0})}
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <ProtectedSection
                password="Y7-nBo"
                hint="А вот тебе сюда нельзя.............. Так же здесь моглабы быть ваша реклама)"
                sessionDuration={9999}
            >
                <div className="subsection">
                    <h3>Основная информация</h3>
                    <div className="input-group">
                        <label>Должность:</label>
                        <select value={position} onChange={(e) => setPosition(e.target.value)}>
                            <option value="Начальник Гарнизона">Начальник Гарнизона</option>
                            <option value="Начальник Штаба">Начальник Штаба</option>
                            <option value="Начальник Штаба Гражданской Обороны">Начальник Штаба Гражданской Обороны</option>
                            <option value="Начальник по Военной Профессиональной Подготовке">Начальник по Военной Профессиональной Подготовке</option>
                            <option value="Командир Подразделения">Командир Подразделения</option>
                            <option value="Заместитель Командира Подразделения">Заместитель Командира Подразделения</option>
                        </select>
                    </div>
                    <div className="input-group">
                        <label>ФИО:</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Введите ваше ФИО"
                        />
                    </div>
                    <div className="input-group">
                        <label>ВрИО:</label>
                        <input
                            type="checkbox"
                            checked={isVrio}
                            onChange={(e) => setIsVrio(e.target.checked)}
                        />
                    </div>
                    <div className="input-group">
                        <label>Подпись:</label>
                        <input
                            type="text"
                            value={signature}
                            onChange={(e) => setSignature(e.target.value)}
                            placeholder="Введите подпись (по умолчанию ФИО)"
                        />
                    </div>
                    <div className="input-group">
                        <label>Период с:</label>
                        <input
                            type="text"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="дд.мм.гггг"
                        />
                    </div>
                    <div className="input-group">
                        <label>Период по:</label>
                        <input
                            type="text"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="дд.мм.гггг"
                        />
                    </div>
                    <div className="input-group">
                        <label>Отработанные часы:</label>
                        <input
                            type="number"
                            value={onlineHours}
                            onChange={(e) => setOnlineHours(parseInt(e.target.value) || 0)}
                            min="21"
                        />
                    </div>
                </div>

                {renderPositionSpecificFields()}

                {visibleSections[position].includes('interviews') && (
                    <div className="subsection">
                        <h3>Собеседования</h3>
                        {interviews.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setInterviews, interviews, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.type}
                                    onChange={(e) => handleItemChange(setInterviews, interviews, index, 'type', e.target.value)}
                                    placeholder="Контракт или Срочка"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setInterviews, interviews, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setInterviews, interviews, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setInterviews, interviews, { date: '', type: '', link: '' })}
                        >
                            Добавить собеседование
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('events') && (
                    <div className="subsection">
                        <h3>Мероприятия</h3>
                        {events.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setEvents, events, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setEvents, events, index, 'name', e.target.value)}
                                    placeholder="Название мероприятия"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setEvents, events, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setEvents, events, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setEvents, events, { date: '', name: '', link: '' })}
                        >
                            Добавить мероприятие
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('lectures') && (
                    <div className="subsection">
                        <h3>Лекции</h3>
                        {lectures.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setLectures, lectures, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setLectures, lectures, index, 'name', e.target.value)}
                                    placeholder="Название лекции"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setLectures, lectures, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setLectures, lectures, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setLectures, lectures, { date: '', name: '', link: '' })}
                        >
                            Добавить лекцию
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('drills') && (
                    <div className="subsection">
                        <h3>Строевая подготовка</h3>
                        {drills.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setDrills, drills, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setDrills, drills, index, 'name', e.target.value)}
                                    placeholder="Название"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setDrills, drills, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setDrills, drills, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setDrills, drills, { date: '', name: '', link: '' })}
                        >
                            Добавить строевую подготовку
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('exercises') && (
                    <div className="subsection">
                        <h3>Учения</h3>
                        {exercises.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setExercises, exercises, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setExercises, exercises, index, 'name', e.target.value)}
                                    placeholder="Название"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setExercises, exercises, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setExercises, exercises, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setExercises, exercises, { date: '', name: '', link: '' })}
                        >
                            Добавить учение
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('shootings') && (
                    <div className="subsection">
                        <h3>Учебные стрельбы</h3>
                        {shootings.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setShootings, shootings, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setShootings, shootings, index, 'name', e.target.value)}
                                    placeholder="Название"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setShootings, shootings, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setShootings, shootings, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setShootings, shootings, { date: '', name: '', link: '' })}
                        >
                            Добавить учебные стрельбы
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('trainings') && (
                    <div className="subsection">
                        <h3>Тренировки</h3>
                        {trainings.map((item, index) => (
                            <div key={index} className="item-row">
                                <input
                                    type="date"
                                    value={item.date}
                                    onChange={(e) => handleItemChange(setTrainings, trainings, index, 'date', e.target.value)}
                                    placeholder="Дата (дд.мм.гггг)"
                                />
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) => handleItemChange(setTrainings, trainings, index, 'name', e.target.value)}
                                    placeholder="Название"
                                />
                                <input
                                    type="text"
                                    value={item.link}
                                    onChange={(e) => handleItemChange(setTrainings, trainings, index, 'link', e.target.value)}
                                    placeholder="Ссылка на доказательство"
                                />
                                <button
                                    className="remove-btn"
                                    onClick={() => handleRemoveItem(setTrainings, trainings, index)}
                                >
                                    Удалить
                                </button>
                            </div>
                        ))}
                        <button
                            className="add-btn"
                            onClick={() => handleAddItem(setTrainings, trainings, { date: '', name: '', link: '' })}
                        >
                            Добавить тренировку
                        </button>
                    </div>
                )}

                {visibleSections[position].includes('attendance') && (
                    <div className="subsection">
                        <h3>Посещение мероприятий (или у лидера, или на ГРП)</h3>
                        <div className="input-group">
                            <label>Тип:</label>
                            <select value={attendanceType} onChange={(e) => setAttendanceType(e.target.value)}>
                                <option value="leader">Качественное мероприятие от лидера</option>
                                <option value="grp">ГРП</option>
                            </select>
                        </div>
                        <div className="input-group">
                            <label>Ссылка на доказательство:</label>
                            <input
                                type="text"
                                value={attendanceLink}
                                onChange={(e) => setAttendanceLink(e.target.value)}
                                placeholder="Ссылка на доказательство"
                            />
                        </div>
                    </div>
                )}

                <div className="subsection">
                    <h3>Сгенерированный отчет</h3>
                    <ExamplePhrase
                        text={generateReport()}
                        type="ms"
                        messageType="multiline"
                    />
                </div>
            </ProtectedSection>
        </>
    );
};

export default ReportGenerator;