import "./styles/index.scss";

import { keyData } from "./js/data.js";
import { createKeyboard } from "./js/keyboard.js";
import { createDOMStructure, getButtonByCode } from "./js/utils.js";
import { getLabel, toggleHighlight } from "./js/keys.js";

export const { body } = document;

let lang = localStorage.getItem("currentLang") || "en";

createDOMStructure();
createKeyboard(lang);

const keyboard = document.querySelector(".keyboard");
const textarea = document.querySelector(".textarea");

textarea.focus();

const shiftButtons = Array.from(document.querySelectorAll(".key__shift"));
const optButtons = Array.from(document.querySelectorAll(".key__opt"));
const capsButton = getButtonByCode("CapsLock");
const ctrlButton = getButtonByCode("ControlLeft");

const TAB_VALUE = " ".repeat(4);

let textareaValue = textarea.value;
let cursorPos = 0;
let currentCode;

let capsActive = false;
let shiftActive = false;
let ctrActive = false;
let optActive = false;

//
//
//

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);

keyboard.addEventListener("click", handleClick);

textarea.addEventListener("click", setCursorPosition);

shiftButtons.forEach((shiftButton) => {
    shiftButton.addEventListener("mousedown", toggleShift);
    shiftButton.addEventListener("mouseup", toggleShift);
});

optButtons.forEach((optButton) => {
    optButton.addEventListener("mousedown", toggleOpt);
    optButton.addEventListener("mouseup", toggleOpt);
});

ctrlButton.addEventListener("mousedown", toggleCtrl);
ctrlButton.addEventListener("mouseup", toggleCtrl);

//
//
//

// CLICK
function handleClick(e) {
    const button = e.target.closest("button");
    if (!button) return;

    currentCode = button.dataset.code;

    textarea.focus();

    if (currentCode === "Backspace") {
        deletePrevChar();
        return;
    }

    if (ctrActive && currentCode === "KeyD") {
        deleteNextChar();
        return;
    }

    if (button.dataset.code === "CapsLock") {
        toggleCaps(e);
    }

    addChar();
}

// KEYDOWN
function handleKeydown(e) {
    e.preventDefault();

    currentCode = e.code;

    textarea.focus();

    if (e.code === "Backspace") {
        deletePrevChar();
        toggleHighlight(e);
        return;
    }

    if (e.code === "ControlLeft") toggleCtrl(e);
    if (ctrActive && currentCode === "KeyD") {
        deleteNextChar();
        toggleHighlight(e);
        return;
    }

    if (e.code === "CapsLock") {
        toggleCaps(e);
    }

    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        toggleShift(e);
    }

    if (e.code === "AltLeft" || e.code === "AltRight") {
        toggleOpt(e);
    }

    if (ctrActive && e.code === "MetaLeft") {
        switchLanguage();
    }

    addChar();
    toggleHighlight(e);
}

// KEYUP
function handleKeyup(e) {
    if (e.code === "ControlLeft") {
        toggleCtrl(e);
    }

    if (e.code === "CapsLock") {
        toggleCaps(e);
    }

    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        toggleShift(e);
    }

    if (e.code === "AltLeft" || e.code === "AltRight") {
        toggleOpt(e);
    }

    toggleHighlight(e);
}

// ADD CHAR
function addChar() {
    const button = getButtonByCode(currentCode);
    const key = getKey(button);

    const prevString = textareaValue.slice(0, cursorPos);
    const pastString = textareaValue.slice(cursorPos);
    textarea.value = prevString + key + pastString;

    textareaValue = textarea.value;

    updateCursorPosition(key.length);
}

// TOGGLE LANG
function switchLanguage() {
    if (lang === "en") lang = "ru";
    else if (lang === "ru") lang = "en";

    localStorage.setItem("currentLang", lang);

    const labelElements = Array.from(document.querySelectorAll(".label"));

    keyData.forEach((data, i) => {
        const labelElement = labelElements[i];
        const label = getLabel(data, lang);

        labelElement.textContent = label.toUpperCase();
    });
}

// TOGGLE CAPS
function toggleCaps(e) {
    e.preventDefault();

    if (capsActive && capsButton.classList.contains("key--active")) {
        capsButton.classList.remove("key--active");
        capsActive = false;
    } else if (!capsActive && !capsButton.classList.contains("key--active")) {
        capsButton.classList.add("key--active");
        capsActive = true;
    }
}

// TOGGLE SHIFT
function toggleShift(e) {
    let shiftButton;

    if (e.target.closest(".key__shift")) {
        shiftButton = e.target.closest(".key__shift");
    } else {
        shiftButton = getButtonByCode(e.code);
    }

    if (e.type === "mousedown" || e.type === "keydown") {
        shiftButton.classList.add("key--active");
        shiftActive = true;
    }

    if (e.type === "mouseup" || e.type === "keyup") {
        shiftButton.classList.remove("key--active");
        shiftActive = false;
    }
}

// TOGGLE OPT
function toggleOpt(e) {
    let optButton;

    if (e.target.closest(".key__opt")) {
        optButton = e.target.closest(".key__opt");
    } else {
        optButton = getButtonByCode(e.code);
    }

    if (e.type === "mousedown" || e.type === "keydown") {
        optButton.classList.add("key--active");
        optActive = true;
    }

    if (e.type === "mouseup" || e.type === "keyup") {
        optButton.classList.remove("key--active");
        optActive = false;
    }
}

// TOGGLE CTRL
function toggleCtrl(e) {
    if (e.type === "mousedown" || e.type === "keydown") {
        ctrlButton.classList.add("key--active");
        ctrActive = true;
    }

    if (e.type === "mouseup" || e.type === "keyup") {
        ctrlButton.classList.remove("key--active");
        ctrActive = false;
    }
}

// DELETE PREV
function deletePrevChar() {
    const idx = cursorPos - 1;
    if (idx < 0 || idx > textareaValue.length) return;

    const stringStart = textareaValue.slice(0, idx);
    const stringEnd = textareaValue.slice(idx + 1);

    textarea.value = stringStart + stringEnd;
    textareaValue = textarea.value;

    updateCursorPosition(-1);
}

// DELETE NEXT
function deleteNextChar() {
    const idx = cursorPos;
    if (idx < 0 || idx > textareaValue.length) return;

    const stringStart = textareaValue.slice(0, idx);
    const stringEnd = textareaValue.slice(idx + 1);

    textarea.value = stringStart + stringEnd;
    textareaValue = textarea.value;

    updateCursorPosition(0);
}

// UPDATE CURSOR POS
function updateCursorPosition(steps) {
    textarea.selectionStart = cursorPos + steps;
    textarea.selectionEnd = textarea.selectionStart;
    cursorPos = textarea.selectionStart;
}

// SET CURSOR POS
function setCursorPosition() {
    cursorPos = textarea.selectionStart;
    textarea.selectionStart = cursorPos;
}

// GET KEY
function getKey(button) {
    let key;

    if (!button.dataset[lang]) key = "";
    if (button.dataset[lang]) key = button.dataset[lang];

    if (shiftActive) {
        const attr = "shift" + lang[0].toUpperCase() + lang.slice(1);
        if (button.dataset[lang]) key = button.dataset[attr];
    }

    if (optActive) {
        const attr = "alt" + lang[0].toUpperCase() + lang.slice(1);
        if (button.dataset[lang]) key = button.dataset[attr];
    }

    if (capsActive) key = key.toUpperCase();

    if (button.dataset.code === "Space") key = " ";
    if (button.dataset.code === "Tab") key = TAB_VALUE;
    if (button.dataset.code === "Enter") key = "\n";

    if (button.dataset.code === "ArrowLeft") key = "←";
    if (button.dataset.code === "ArrowRight") key = "→";
    if (button.dataset.code === "ArrowUp") key = "↑";
    if (button.dataset.code === "ArrowDown") key = "↓";

    return key;
}
