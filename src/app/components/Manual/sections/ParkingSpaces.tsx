import React from 'react';

const ParkingSpaces = () => {
    // Исправленные данные с правильным распределением по колонкам
    const commandersData = [
        { place: 1, person: "Akymi_Costello", car: "Ford F-450", license: "В666КС 77" },
        { place: 2, person: "-", car: "-", license: "-" },
        { place: 3, person: "Kirill_Good", car: "Mercedes-Benz 560SEL W126", license: "М013ЕР77" },
        { place: 4, person: "-", car: "-", license: "-" },
        { place: 5, person: "Aristotel_Roberts", car: "Tesla Model S Plaid", license: "С000АС78" },
        { place: 6, person: "-", car: "-", license: "-" },
        { place: 7, person: "-", car: "-", license: "-" },
        { place: 8, person: "-", car: "-", license: "-" }
    ];

    const deputiesData = [
        { place: 9, person: "-", car: "-", license: "-" },
        { place: 10, person: "-", car: "-", license: "-" },
        { place: 11, person: "-", car: "-", license: "-" },
        { place: 12, person: "-", car: "-", license: "-" }
    ];

    const juniorData = [
        { place: 13, person: "Alexey_Tsarkov", car: "Audi RS7 (C8)", license: "Р777СС78" },
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
        { place: 34, person: "Pavel_Washington", car: "BMW 530d (E39)", license: "А489НК63" },
        { place: 35, person: "Artemy_Brooklins", car: "BMW 530d (E39)", license: "-" },
        { place: 36, person: "-", car: "BMW 750I Е38", license: "У001МО77" }
    ];

    const TableSection = ({ title, data, headerClass }) => (
        <table className="parking-section-table">
            <thead>
            <tr className={`parking-section-header ${headerClass}`}>
                <td colSpan="4">{title}</td>
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
            <style jsx>{`
        
      `}</style>

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