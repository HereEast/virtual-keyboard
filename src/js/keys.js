import { createElement } from "./utils.js";
export { applyClasses, getLabel, getArrowButtons, toggleHighlight };


// CLASSES
const cssClasses = {
    Backspace: "key__delete",
    Tab: "key__tab",
    MetaLeft: "key__cmd--left",
    MetaRight: "key__cmd--right",
    CapsLock: "key__caps",
    Enter: ["key__return", "label--small"],
    ShiftLeft: ["key__shift--left", "key__shift"],
    ShiftRight: ["key__shift--right", "key__shift"],
    Space: "key__space",
    Fn: "key__fn",
    AltLeft: ["key__opt", "key__opt--left"],
    AltRight: ["key__opt", "key__opt--right"],
    ControlLeft: "key__ctrl",
    ArrowLeft: "key__arrow",
    ArrowUp: "key__arrow",
    ArrowDown: "key__arrow",
    ArrowRight: "key__arrow",
};

//

// HIGHLIGHT KEYS
function toggleHighlight(e) {
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
function applyClasses(button) {
    const code = button.dataset.code;
    const buttonClass = cssClasses[code];

    if (buttonClass) {
        if (Array.isArray(buttonClass)) {
            button.classList.add(...buttonClass, "label--small");
        } else {
           button.classList.add(buttonClass, "label--small"); 
        }
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
