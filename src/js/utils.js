import { body } from "../index.js";
export { createElement, createDOMStructure, getButtonByCode };

// GET BUTTON
function getButtonByCode(code) {
    const button = document.querySelector(`[data-code=${code}]`);
    return button;
}

// CREATE ELEMENT
function createElement(tagName, ...classNames) {
    const element = document.createElement(tagName);
    element.classList.add(...classNames);

    return element;
}

// DOM
function createDOMStructure() {
    const page = createElement("div", "page");
    const main = createElement("main", "main");
    const textareaContainer = createElement("div", "textarea__container");
    const textarea = createElement("textarea", "textarea");
    const keyboard = createElement("div", "keyboard");
    const keyboardContainer = createElement("div", "keyboard__container");

    textareaContainer.append(textarea);
    keyboard.append(keyboardContainer);
    main.append(textareaContainer, keyboard);
    page.append(main);
    body.prepend(page);
}