import React from 'react';
import DropdownMenu from "@/app/components/Manual/DropdownMenu";

const RPTaskSection = () => {
    const rptaskvp = [
        "Замена колеса",
        "Замена ремня ГРМ",
        "Замена Масла",
    ];
    const rptaskvpIcon = {
        "Замена колеса":"💪",
        "Замена ремня ГРМ":"🦵",
        "Замена Масла":"🏃‍♂️",
    }
    const rptaskvpContent = {
        "Замена колеса": [
            "me открыл багажник",
            "do В багажнике лежит ящик с инструментами.",
            "me взял ящик с инструментами",
            "do Ящик с инструментами в правой руке.",
            "me положил ящик на землю",
            "do Домкрат в багажнике.",
            "me взял домкрат",
            "me положил домкрат на землю",
            "me поднимает машину домкратом",
            "do Машина поднята на домкрат.",
            "me открыл ящик с инструментами",
            "me взял ключ на 13",
            "me открутил болты",
            "me снимает колесо",
            "do Колесо снято.",
            "me взял колесо в руки",
            "me положил колесо на землю",
            "do Колесо на земле.",
            "do В багажнике запасное колесо.",
            "me взял запасное колесо",
            "me поставил колесо на место",
            "me закручивает болты",
            "do Болты закручены.",
            "me опускает машину домкратом",
            "me взял ящик с инструментами",
            "me положил ящик в багажник",
            "me взял домкрат в руки",
            "me положил домкрат в багажник и закрыла его"
        ],
        "Замена ремня ГРМ": [
            "do В бардачке лежит отвертка.",
            "me открыв багдачок, взял отвертку",
            "me открыл капот",
            "me снимает ремень ГРМ",
            "me снял ремень ГРМ",
            "do Ремень ГРМ в руках.",
            "do В багажнике лежит новый ремень ГРМ.",
            "me открыл багажник",
            "me положил старый ремень ГРМ в багажник",
            "me взял новый ремень ГРМ",
            "me поставил новый ремень ГРМ",
            "me проверил натяжение",
            "me закрыл капот"
        ],
        "Замена Масла": [
            "do Отвертка в руках.",
            "me залезла под машину",
            "me откручивает сливную гайку",
            "me открыла гайку",
            "do Масло вытекло.",
            "me закрутила гайку",
            "me открыла капот",
            "me открыла крышку с надписью \"Oil\"",
            "do В багажнике лежит канистра с новым маслом.",
            "me взяла новое масло",
            "me открыла масло",
            "me залила масло в автомобиль",
            "me проверила уровень масла",
            "me закрыла крышку с надписью \"Oil\"",
            "me закрыла капот"
        ]
    };
    const rptaskvvs = [
        "Замена колеса",
        "Замена ремня ГРМ",
        "Замена Масла",
    ];
    const rptaskvvsIcon = {};
    const rptaskvvsContent = {

    };
    return (
        <>
            <div className="subsection">
                <h3>🏟️ Места проведения РП задания</h3>
                <p>РП задания проводятся у ангара:</p>
            </div>
            <div className="subsection">
                <h3>📚 РП задания для военной полиции</h3>

                <div className="space-y-3 mt-4">
                    {rptaskvp.map((training) => (
                        <DropdownMenu
                            title={training}
                            icon={rptaskvpIcon[training as keyof typeof rptaskvpContent] || "📖"}
                            items={rptaskvpContent[training as keyof typeof rptaskvpContent] || ["Содержание будет добавлено позже"]}
                        />
                    ))}
                </div>
                <div className="subsection">
                    <h3>📚 РП задания для Военно Воздушных Сил</h3>

                    <div className="space-y-3 mt-4">
                        {rptaskvvs.map((training) => (
                            <DropdownMenu
                                title={training}
                                icon={rptaskvvsIcon[training as keyof typeof rptaskvvsContent] || "📖"}
                                items={rptaskvvsContent[training as keyof typeof rptaskvvsContent] || ["Содержание будет добавлено позже"]}
                            />
                        ))}
                    </div>
            </div>
        </>
    );
};

export default RPTaskSection;