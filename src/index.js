import "./styles/index.scss";

import { createKeyboard } from "./js/keyboard.js";
import { createDOMStructure, getButtonByCode } from "./js/utils.js";
import { toggleKeyHighlight } from "./js/keys.js";

export const { body } = document;

let lang = "en";

createDOMStructure();
createKeyboard(lang);

const keyboard = document.querySelector(".keyboard");
const textarea = document.querySelector(".textarea");

const shiftButtons = Array.from(document.querySelectorAll(".key__shift"));
const commandButtons = Array.from(document.querySelectorAll(".key__cmd"));
const capsButton = getButtonByCode("CapsLock");
const ctrlButton = getButtonByCode("ControlLeft");

const TAB_VALUE = " ".repeat(4);

let string = textarea.value;

let cursorPos = 0;
let currentCode;

let capsActive = false;
let shiftActive = false;
let ctrActive = false;
let commandActive = false;

//

textarea.focus();

//

window.addEventListener("keydown", handleKeydown);
window.addEventListener("keyup", handleKeyup);
keyboard.addEventListener("click", handleClick);

textarea.addEventListener("input", handleInput);
textarea.addEventListener("click", setCursorPosition);

shiftButtons.forEach((shiftButton) => {
    shiftButton.addEventListener("mousedown", toggleShiftOnClick);
    shiftButton.addEventListener("mouseup", toggleShiftOnClick);
});

commandButtons.forEach((commandButton) => {
    commandButton.addEventListener("mousedown", toggleCommand);
    commandButton.addEventListener("mouseup", toggleCommand);
});

ctrlButton.addEventListener("mousedown", toggleCtrl);
ctrlButton.addEventListener("mouseup", toggleCtrl);

// INPUT
function handleInput() {
    capsActive = capsButton.classList.contains("key--active");
    shiftActive = shiftButtons.some((button) => button.classList.contains("key--active"));
    commandActive = commandButtons.some((button) => button.classList.contains("key--active"));

    if (capsActive) {
        const button = getButtonByCode(currentCode);
        const key = getKey(button).toUpperCase();

        // updateCursorPosition(0);
        addSubstring(key);
    }

    if (shiftActive) {
        let key;

        const button = getButtonByCode(currentCode);
        const attr = "shift" + lang[0].toUpperCase() + lang.slice(1);

        if (button.dataset[lang]) key = button.dataset[attr];
        else return;

        // updateCursorPosition(0);
        addSubstring(key);
    }
}

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
        deleteNextChar(e);
        return;
    }

    if (currentCode.includes("Arrow")) handleArrows();

    let key = getKey(button);

    if (button.dataset.code === "CapsLock") toggleCaps(e);
    if (capsActive) key = key.toUpperCase();

    addSubstring(key);

    string = textarea.value;
}

// KEYDOWN
function handleKeydown(e) {
    currentCode = e.code;
    textarea.focus();

    if (e.code === "CapsLock") toggleCaps(e);
    if (e.code === "ControlLeft") toggleCtrl(e);

    if (ctrActive && currentCode === "KeyD") {
        // e.preventDefault();
        deleteNextChar(e);
        return;
    }

    if (currentCode === "Tab") {
        e.preventDefault();
        addSubstring(TAB_VALUE);
    }

    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        shiftActive = true;
    }

    if (e.code === "MetaLeft" || e.code === "MetaRight") {
        commandActive = true;
    }

    toggleKeyHighlight(e);
}

// KEYUP
function handleKeyup(e) {
    if (e.code === "CapsLock") toggleCaps(e);
    if (e.code === "ControlLeft") toggleCtrl(e);

    shiftActive = false;
    commandActive = false;

    console.log(e.code);

    string = textarea.value;
    cursorPos = textarea.selectionStart;

    toggleKeyHighlight(e);
}

// COMMAND
function toggleCommand(e) {
    const commandButton = e.target.closest(".key__cmd");

    if (e.type === "mousedown") {
        commandButton.classList.add("key--active");
        commandActive = true;
    }

    if (e.type === "mouseup") {
        commandButton.classList.remove("key--active");
        commandActive = false;
    }
}

// ARROWS
function handleArrows() {
    if (currentCode === "ArrowLeft") {
        if (cursorPos === 0) return;
        updateCursorPosition(-1);
    }

    if (currentCode === "ArrowRight") {
        if (cursorPos === textarea.value.length) return;
        updateCursorPosition(1);
    }
}

// ADD CHAR TO TEXTAREA
function addSubstring(substr) {
    // setCursorPosition();
    updateCursorPosition(0);

    const prevString = string.slice(0, cursorPos);
    const pastString = string.slice(cursorPos);
    textarea.value = prevString + substr + pastString;

    updateCursorPosition(substr.length);
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

// DELETE PREV
function deletePrevChar() {
    const idx = cursorPos - 1;
    if (idx < 0) return;

    const stringStart = textarea.value.slice(0, idx);
    const stringEnd = textarea.value.slice(idx + 1);
    textarea.value = stringStart + stringEnd;

    updateCursorPosition(-1);
}

// DELETE NEXT
function deleteNextChar(e) {
    e.preventDefault();
    const idx = cursorPos;

    const stringStart = textarea.value.slice(0, idx);
    const stringEnd = textarea.value.slice(idx + 1);
    textarea.value = stringStart + stringEnd;

    updateCursorPosition(0);
}

// TOGGLE CAPS
function toggleCaps(e) {
    e.preventDefault();

    capsButton.classList.toggle("key--active");

    if (capsButton.classList.contains("key--active")) capsActive = true;
    else capsActive = false;
}

// TOGGLE SHIFT
function toggleShiftOnClick(e) {
    const shiftButton = e.target.closest(".key__shift");

    if (e.type === "mousedown") {
        shiftButton.classList.add("key--active");
        shiftActive = true;
    }

    if (e.type === "mouseup") {
        shiftButton.classList.remove("key--active");
        shiftActive = false;
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

// GET KEY
function getKey(button) {
    let key;

    if (!button.dataset[lang]) key = "";
    if (button.dataset[lang]) key = button.dataset[lang];

    if (shiftActive) {
        const attr = "shift" + lang[0].toUpperCase() + lang.slice(1);
        if (button.dataset[lang]) key = button.dataset[attr];
    }

    if (button.dataset.code === "Space") key = " ";
    if (button.dataset.code === "Tab") key = TAB_VALUE;
    if (button.dataset.code === "Enter") key = "\n";

    return key;
}
