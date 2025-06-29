import React from 'react';

interface ParkingData {
    place: number;
    person: string;
    car: string;
    license: string;
}

interface TableSectionProps {
    title: string;
    data: ParkingData[];
    headerClass: string;
}

const ParkingSpaces = () => {
    // Исправленные данные с правильным распределением по колонкам
    const commandersData: ParkingData[] = [
        { place: 1, person: "-", car: "-", license: "-" },
        { place: 2, person: "-", car: "-", license: "-" },
        { place: 3, person: "-", car: "-", license: "-" },
        { place: 4, person: "-", car: "-", license: "-" },
        { place: 5, person: "-", car: "-", license: "-" },
        { place: 6, person: "-", car: "-", license: "-" },
        { place: 7, person: "-", car: "-", license: "-" },
        { place: 8, person: "-", car: "-", license: "-" }
    ];

    const deputiesData: ParkingData[] = [
        { place: 9, person: "-", car: "-", license: "-" },
        { place: 10, person: "-", car: "-", license: "-" },
        { place: 11, person: "-", car: "-", license: "-" },
        { place: 12, person: "-", car: "-", license: "-" }
    ];

    const juniorData: ParkingData[] = [
        { place: 13, person: "-", car: "-", license: "-" },
        { place: 14, person: "-", car: "-", license: "-" },
        { place: 15, person: "-", car: "-", license: "-" },
        { place: 16, person: "-", car: "-", license: "-" },
        { place: 17, person: "-", car: "-", license: "-" },
        { place: 18, person: "-", car: "-", license: "-" },
        { place: 19, person: "-", car: "-", license: "-" },
        { place: 20, person: "-", car: "-", license: "-" },
        { place: 21, person: "-", car: "-", license: "-" },
        { place: 22, person: "-", car: "-", license: "-" },
        { place: 23, person: "-", car: "-", license: "-" },
        { place: 24, person: "-", car: "-", license: "-" },
        { place: 25, person: "-", car: "-", license: "-" },
        { place: 26, person: "-", car: "-", license: "-" },
        { place: 27, person: "-", car: "-", license: "-" },
        { place: 28, person: "-", car: "-", license: "-" },
        { place: 29, person: "-", car: "-", license: "-" },
        { place: 30, person: "-", car: "-", license: "-" },
        { place: 31, person: "-", car: "-", license: "-" },
        { place: 32, person: "-", car: "-", license: "-" },
        { place: 33, person: "-", car: "-", license: "-" },
        { place: 34, person: "-", car: "-", license: "-" },
        { place: 35, person: "-", car: "-", license: "-" },
        { place: 36, person: "-", car: "-", license: "-" }
    ];

    const TableSection: React.FC<TableSectionProps> = ({ title, data, headerClass }) => (
        <table className="parking-section-table">
            <thead>
            <tr className={`parking-section-header ${headerClass}`}>
                <td colSpan={4}>{title}</td>
            </tr>
            <tr>
                <th>№ места</th>
                <th>Сотрудник</th>
                <th>Автомобиль</th>
                <th>Гос. номер</th>
            </tr>
            </thead>
            <tbody>
            {data.map((row) => (
                <tr key={row.place} className={row.person !== "-" ? "occupied" : ""}>
                    <td className="parking-place-number">{row.place}</td>
                    <td className="parking-person-name">{row.person}</td>
                    <td className="parking-car-model">{row.car}</td>
                    <td>
                        <span className="parking-license-plate">{row.license}</span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-purple-800 p-5">
            <div className="parking-table-container">
                <div className="parking-table-header">
                    <h1>🚗 Распределение парковочных мест</h1>
                </div>

                <TableSection
                    title="Маршал, Начальники и Командиры подразделений (места 1-8)"
                    data={commandersData}
                    headerClass="commanders"
                />

                <TableSection
                    title="Заместители Командиров Подразделений (места 9-12)"
                    data={deputiesData}
                    headerClass="deputies"
                />

                <TableSection
                    title="Младший состав (места 13-36)"
                    data={juniorData}
                    headerClass="junior"
                />
            </div>
        </div>
    );
};

export default ParkingSpaces;