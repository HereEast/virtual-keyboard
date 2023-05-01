import { keyData } from "./data.js";
import { createElement } from "./utils.js";
import { applyCssClasses, getLabel, getArrowButtons } from "./keys.js";
export { createKeyboard };

class Keyboard {
    constructor(lang) {
        this.lang = lang;
    }

    create() {
        const container = document.querySelector(".keyboard__container");

        keyData.forEach((data) => {
            const lang = this.lang;
            const label = getLabel(data, lang);

            const button = createElement("button", "key");

            button.dataset.code = data.code;

            if (data.key.en) {
                button.dataset.en = data.key.en;
                button.dataset.ru = data.key.ru;
            }

            if (data.shift) {
                button.dataset.shiftEn = data.shift.en;
                button.dataset.shiftRu = data.shift.ru;
            }

            applyCssClasses(button);

            const labelElement = createElement("span", "label");
            labelElement.textContent = label.toUpperCase();

            button.append(labelElement);
            container.append(button);
        });

        const arrowButtons = getArrowButtons();
        container.append(arrowButtons);
    }
}

// Create keyboard
function createKeyboard(lang) {
    const keyboard = new Keyboard(lang);
    keyboard.create();
}
