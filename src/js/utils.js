import { body } from "../index.js";
export { createElement, createDOMStructure, getButtonByCode };

// GET BUTTON
function getButtonByCode(code) {
    const button = document.querySelector(`[data-code=${code}]`);
    return button;
}

// CREATE ELEMENT
function createElement(tagName, className) {
    const element = document.createElement(tagName);
    element.classList.add(className);

    return element;
}

// DOM
function createDOMStructure() {
    const text = `This keyboard was created for Mac OS. <br> To delete prev character use <span>DELETE</span>, to delete next — <span>CTRL + D</span> <br>To switch languages use <span>CTRL + CMD</span>`;

    const PRtext = `Here is a link to <a target="_blank" href="https://github.com/HereEast/virtual-keyboard/pull/2">Pull Request</a>. Sorry:)`;

    const page = createElement("div", "page");
    const main = createElement("main", "main");
    const introContainer = createElement("div", "intro__container");
    const textareaContainer = createElement("div", "textarea__container");
    const textarea = createElement("textarea", "textarea");
    const keyboard = createElement("div", "keyboard");
    const keyboardContainer = createElement("div", "keyboard__container");

    const description = createElement("p", "description");
    description.innerHTML = text;

    const note = createElement("p", "note");
    note.innerHTML = PRtext;

    introContainer.append(description);

    textareaContainer.append(textarea);
    keyboard.append(keyboardContainer);
    main.append(introContainer, textareaContainer, keyboard, note);
    page.append(main);
    body.prepend(page);
}