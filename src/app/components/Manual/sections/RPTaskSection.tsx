import React from 'react';
import DropdownMenu from "@/app/components/Manual/DropdownMenu";

const RPTaskSection = () => {
    const RpTaskVP = [
        "Замена колеса",
        "Замена ремня ГРМ",
        "Замена Масла",
    ];
    const RpTaskVPIcon = {
        "Замена колеса":"💪",
        "Замена ремня ГРМ":"🦵",
        "Замена Масла":"🏃‍♂️",
    };
    const RpTaskVPContent = {
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
    const RpTaskVVS = [
        "Замена колеса",
        "Замена ремня ГРМ",
        "Замена Масла",
    ];
    const RpTaskVVSIcon = {};
    const RpTaskVVSContent = {};
    return (
        <>
            <div className="subsection">
                <h3>🏟️ Места проведения РП задания</h3>
                <p>РП задания проводятся у ангара:</p>
            </div>
            <div className="subsection">
                <h3>📚 РП задания для военной полиции</h3>

                <div className="space-y-3 mt-4">
                    {RpTaskVP.map((training) => (
                        <DropdownMenu
                            title={training}
                            icon={RpTaskVPIcon[training as keyof typeof RpTaskVPContent] || "📖"}
                            items={RpTaskVPContent[training as keyof typeof RpTaskVPContent] || ["Содержание будет добавлено позже"]}
                        />
                    ))}
                </div>
            </div>
            <div className="subsection">
                <h3>📚 РП задания для Военно Воздушных Сил</h3>

                <div className="space-y-3 mt-4">
                    {RpTaskVVS.map((training) => (
                        <DropdownMenu
                            title={training}
                            icon={RpTaskVVSIcon[training as keyof typeof RpTaskVVSContent] || "📖"}
                            items={RpTaskVVSContent[training as keyof typeof RpTaskVVSContent] || ["Содержание будет добавлено позже"]}
                        />
                    ))}
                </div>
            </div>
        </>
    );        
            
};

export default RPTaskSection;