import { createElement } from "./utils.js";
export { applyCssClasses, getLabel, getArrowButtons, toggleKeyHighlight };


// CLASSES
const cssClasses = {
    Backspace: "key__delete",
    Tab: "key__tab",
    MetaLeft: "key__cmd--left",
    MetaRight: "key__cmd--right",
    CapsLock: "key__caps",
    Enter: "key__return",
    ShiftLeft: "key__shift--left",
    ShiftRight: "key__shift--right",
    Space: "key__space",
    Fn: "key__fn",
    AltLeft: "key__opt",
    AltRight: "key__opt",
    ControlLeft: "key__ctrl",
    ArrowLeft: "key__arrow",
    ArrowUp: "key__arrow",
    ArrowDown: "key__arrow",
    ArrowRight: "key__arrow",
};

//

// HIGHLIGHT KEYS
function toggleKeyHighlight(e) {
    const selector = `[data-code=${e.code}]`;
    const button = document.querySelector(selector);

    if (e.type === "keydown") button.classList.add("key--active");
    if (e.type === "keyup") button.classList.remove("key--active");
    else return;
}

// GET LABEL
function getLabel(data, lang) {
    let label = data.key[lang] ? data.key[lang] : data.key;

    if (label === "Enter") label = "Return";
    if (label === "Backspace") label = "Delete";
    if (label === "CapsLock") label = "Caps Lock";
    if (label === "Alt") label = "Opt";
    if (label === "Meta") label = "Cmd";
    if (label === "Control") label = "Ctrl";
    if (label === "ArrowLeft") label = "";
    if (label === "ArrowUp") label = "";
    if (label === "ArrowDown") label = "";
    if (label === "ArrowRight") label = "";

    return label;
}

// APPLY CSS CLASSES
function applyCssClasses(button) {
    const code = button.dataset.code;
    const buttonClass = cssClasses[code];

    if (buttonClass) {
        button.classList.add(buttonClass, "label--small");
    }

    if (button.classList.contains("key__shift--left") || button.classList.contains("key__shift--right")) {
        button.classList.add("key__shift");
    }

    if (button.classList.contains("key__cmd--left") || button.classList.contains("key__cmd--right")) {
        button.classList.add("key__cmd");
    }
}

// ARROW BUTTONS
function getArrowButtons() {
    const arrowButtons = document.querySelectorAll(".key__arrow");

    const arrowsContainer = createElement("div", "arrows");
    const middleArrows = createElement("div", "arrows--middle");

    arrowButtons.forEach((button) => {
        const code = button.dataset.code;

        if (code.includes("Up") || code.includes("Down")) {
            middleArrows.append(button);
        } else {
            arrowsContainer.append(button);
        }
    });

    const arrowLeft = arrowsContainer.children[0];
    arrowLeft.after(middleArrows);

    return arrowsContainer;
}
