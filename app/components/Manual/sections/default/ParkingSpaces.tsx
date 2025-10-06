import React, { useState, useEffect } from 'react';
import { Edit2, Save, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { AuthService } from '@/lib/auth/auth-service';
import "@/app/styles/parkingSpaces.css";

interface ParkingData {
    id: number;
    place: number;
    person: string;
    car: string;
    license: string;
    category: string;
    updated_at?: string;
    updated_by?: string;
}

interface TableSectionProps {
    title: string;
    data: ParkingData[];
    headerClass: string;
    canEdit: boolean;
    onEdit: (place: number) => void;
    onSave: (place: number, data: Partial<ParkingData>) => void;
    onCancel: (place: number) => void;
    editingPlace: number | null;
    editData: Partial<ParkingData> | null;
    setEditData: (data: Partial<ParkingData>) => void;
    isSaving: boolean;
}

const ParkingSpaces = () => {
    const { user } = useAuth();
    const [parkingData, setParkingData] = useState<ParkingData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPlace, setEditingPlace] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<ParkingData> | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null);

    // Проверка прав на редактирование
    const canEdit = user && ['root', 'admin', 'cc'].includes(user.role);

    // Загрузка данных
    useEffect(() => {
        fetchParkingData();
    }, []);

    const fetchParkingData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/parking-spaces');
            const data = await response.json();

            if (response.ok) {
                setParkingData(data.spaces || []);
            } else {
                showNotification('error', 'Не удалось загрузить данные о парковке');
            }
        } catch (error) {
            console.error('Error fetching parking data:', error);
            showNotification('error', 'Ошибка при загрузке данных');
        } finally {
            setIsLoading(false);
        }
    };

    const showNotification = (type: 'success' | 'error', message: string) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleEdit = (place: number) => {
        const spaceData = parkingData.find(s => s.place === place);
        if (spaceData) {
            setEditingPlace(place);
            setEditData({
                person: spaceData.person,
                car: spaceData.car,
                license: spaceData.license,
            });
        }
    };

    const handleSave = async (place: number, data: Partial<ParkingData>) => {
        if (!data.person || !data.car || !data.license) {
            showNotification('error', 'Все поля должны быть заполнены');
            return;
        }

        try {
            setIsSaving(true);
            const response = await AuthService.fetchWithAuth('/api/parking-spaces', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    place,
                    person: data.person.trim(),
                    car: data.car.trim(),
                    license: data.license.trim(),
                }),
            });

            if (response.ok) {
                const updatedSpace = await response.json();
                setParkingData(prev =>
                    prev.map(s => (s.place === place ? { ...s, ...updatedSpace } : s))
                );
                setEditingPlace(null);
                setEditData(null);
                showNotification('success', `Место №${place} успешно обновлено`);
            } else {
                const error = await response.json();
                showNotification('error', error.error || 'Ошибка при сохранении');
            }
        } catch (error) {
            console.error('Error saving parking space:', error);
            showNotification('error', 'Ошибка при сохранении данных');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingPlace(null);
        setEditData(null);
    };

    const handleKeyPress = (e: React.KeyboardEvent, place: number) => {
        if (e.key === 'Enter' && editData) {
            handleSave(place, editData);
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    const TableSection: React.FC<TableSectionProps> = ({
                                                           title,
                                                           data,
                                                           headerClass,
                                                           canEdit,
                                                           onEdit,
                                                           onSave,
                                                           onCancel,
                                                           editingPlace,
                                                           editData,
                                                           setEditData,
                                                           isSaving,
                                                       }) => (
        <table className="parking-section-table">
            <thead>
            <tr className={`parking-section-header ${headerClass}`}>
                <td colSpan={canEdit ? 5 : 4}>{title}</td>
            </tr>
            <tr>
                <th>№ места</th>
                <th>Сотрудник</th>
                <th>Автомобиль</th>
                <th>Гос. номер</th>
                {canEdit && <th style={{ width: '120px' }}>Действие</th>}
            </tr>
            </thead>
            <tbody>
            {data.map((row) => {
                const isEditing = editingPlace === row.place;
                const isOccupied = row.person !== '-';

                return (
                    <tr
                        key={row.place}
                        className={`${isOccupied ? 'occupied' : ''} ${isEditing ? 'editing' : ''}`}
                    >
                        <td className="parking-place-number">{row.place}</td>
                        <td className="parking-person-name">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.person || ''}
                                    onChange={(e) =>
                                        setEditData({ ...editData, person: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyPress(e, row.place)}
                                    className="edit-input"
                                    placeholder="Имя сотрудника"
                                    autoFocus
                                    disabled={isSaving}
                                />
                            ) : (
                                row.person
                            )}
                        </td>
                        <td className="parking-car-model">
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.car || ''}
                                    onChange={(e) =>
                                        setEditData({ ...editData, car: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyPress(e, row.place)}
                                    className="edit-input"
                                    placeholder="Модель автомобиля"
                                    disabled={isSaving}
                                />
                            ) : (
                                row.car
                            )}
                        </td>
                        <td>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editData?.license || ''}
                                    onChange={(e) =>
                                        setEditData({ ...editData, license: e.target.value })
                                    }
                                    onKeyDown={(e) => handleKeyPress(e, row.place)}
                                    className="edit-input"
                                    placeholder="Гос. номер"
                                    disabled={isSaving}
                                />
                            ) : (
                                <span className="parking-license-plate">{row.license}</span>
                            )}
                        </td>
                        {canEdit && (
                            <td className="action-cell">
                                {isEditing ? (
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => onSave(row.place, editData!)}
                                            disabled={isSaving}
                                            className="save-btn"
                                            title="Сохранить"
                                        >
                                            {isSaving ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => onCancel(row.place)}
                                            disabled={isSaving}
                                            className="cancel-btn"
                                            title="Отменить"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => onEdit(row.place)}
                                        className="edit-btn"
                                        title="Редактировать"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        )}
                    </tr>
                );
            })}
            </tbody>
        </table>
    );

    if (isLoading) {
        return (
            <div className="parking-table-container">
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-slate-300">Загрузка данных о парковке...</span>
                </div>
            </div>
        );
    }

    const commandersData = parkingData.filter(s => s.category === 'commanders');
    const deputiesData = parkingData.filter(s => s.category === 'deputies');
    const juniorData = parkingData.filter(s => s.category === 'junior');

    return (
        <div className="parking-table-container">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="parking-table-header">
                <h1>🚗 Распределение парковочных мест</h1>
                {canEdit && (
                    <p className="edit-hint">
                        Нажмите на иконку редактирования для изменения данных. Enter - сохранить, Esc - отменить.
                    </p>
                )}
            </div>

            <TableSection
                title="Маршал, Начальники и Командиры подразделений (места 1-8)"
                data={commandersData}
                headerClass="commanders"
                canEdit={!!canEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editingPlace={editingPlace}
                editData={editData}
                setEditData={setEditData}
                isSaving={isSaving}
            />

            <TableSection
                title="Заместители Командиров Подразделений (места 9-12)"
                data={deputiesData}
                headerClass="deputies"
                canEdit={!!canEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editingPlace={editingPlace}
                editData={editData}
                setEditData={setEditData}
                isSaving={isSaving}
            />

            <TableSection
                title="Младший состав (места 13-36)"
                data={juniorData}
                headerClass="junior"
                canEdit={!!canEdit}
                onEdit={handleEdit}
                onSave={handleSave}
                onCancel={handleCancel}
                editingPlace={editingPlace}
                editData={editData}
                setEditData={setEditData}
                isSaving={isSaving}
            />
        </div>
    );
};

export default ParkingSpaces;