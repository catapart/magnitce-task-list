// task-list.css?raw
var task_list_default = ':host\r\n{\r\n    --border-color: rgb(95, 95, 95);\r\n    display: inline-block;\r\n    border: solid 1px var(--border-color);\r\n    border-radius: 3px;\r\n    padding: .5em;\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    :host\r\n    {\r\n        --border-color: rgb(71, 71, 71);\r\n    }\r\n}\r\n\r\n\r\n[part="header"]\r\n{\r\n    display: grid;\r\n    grid-template-columns: auto 1fr auto;\r\n    align-items: stretch;\r\n    position: sticky;\r\n}\r\n\r\n[part="color-container"]\r\n{\r\n    display: contents;\r\n}\r\n\r\n[part="color"]\r\n{\r\n    /* margin: .5em; */\r\n    padding: 0;\r\n    width: 12px;\r\n    min-height: 0;\r\n    height: auto;\r\n    /* border-radius: 3px; */\r\n    border: solid 1px transparent;\r\n}\r\n[part="color"]::-moz-color-swatch \r\n{\r\n    border: none;\r\n    /* border-radius: 3px; */\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n[part="color"]::-webkit-color-swatch-wrapper \r\n{\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n[part="color"]::-webkit-color-swatch \r\n{\r\n    border: none;\r\n    /* border-radius: 3px; */\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n[part="name"]\r\n{\r\n    /* margin: .5em 0; */\r\n}\r\n\r\n[part="collapse-button"]\r\n{\r\n    /* margin: .5em; */\r\n}\r\n\r\n[part="tasks"]\r\n{\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    display: flex;\r\n    flex-direction: column;\r\n    /* min-height: 350px; */\r\n}\r\n\r\n[part="add-button"]\r\n{\r\n    margin-top: 1rem;\r\n    min-width: 100px;\r\n    align-self: center;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 5px;\r\n}\r\n\r\n:host([collapsed]) > [part="tasks"]\r\n{\r\n    overflow: hidden;\r\n    height: min-content;\r\n}\r\n:host([collapsed]) > [part="tasks"] ::slotted(*)\r\n{\r\n    height: 0;\r\n    opacity: 0;\r\n    display: block;\r\n    white-space: nowrap;\r\n    padding: 0;\r\n    margin: 0;\r\n    border: none;\r\n    pointer-events: none;\r\n    user-select: none;\r\n}\r\n\r\n::slotted([data-drag-id])\r\n{\r\n    opacity: .7;\r\n    scale: .97;\r\n    transition: opacity 100ms ease, scale 100ms ease;\r\n}';

// task-list.html?raw
var task_list_default2 = '<slot name="header">\r\n    <header part="header">\r\n        <label part="color-container" title="Color">\r\n            <input type="color" part="color" value="#919191" />\r\n        </label>\r\n        <input type="text" part="name" placeholder="List Name" />\r\n        <button type="button" part="collapse-button" title="Collapse">\u25B2</button>\r\n    </header>\r\n</slot>\r\n<ul part="tasks">\r\n    <slot></slot>\r\n    <slot name="add-button"><button type="button" part="add-button" title="Add"><span part="icon">&plus;</span>Add Task</button></slot>\r\n</ul>\r\n<slot name="footer"></slot>';

// node_modules/.pnpm/@magnit-ce+task-card@0.0.2/node_modules/@magnit-ce/task-card/dist/task-card.js
var task_card_default = ':host\n{\n    --border-color: rgb(95, 95, 95);\n    border: solid 1px var(--border-color);\n    border-radius: 3px;\n    padding: 0;\n    margin: .25em;\n    display: inline-flex;\n}\n@media (prefers-color-scheme: dark) \n{\n    :host\n    {\n        --border-color: rgb(71, 71, 71);\n    }\n}\n\n[part="color-container"]\n{\n    display: contents;\n}\n\n[part="color"]\n{\n    margin: 0;\n    padding: 0;\n    width: 7.5px;\n    min-height: 0;\n    height: auto;\n    border: none;\n}\n[part="color"]::-moz-color-swatch \n{\n    border: none;\n    padding: 0;\n    margin: 0;\n}\n\n[part="color"]::-webkit-color-swatch-wrapper \n{\n    padding: 0;\n    margin: 0;\n}\n\n[part="color"]::-webkit-color-swatch \n{\n    border: none;\n    padding: 0;\n    margin: 0;\n}\n\n[part="is-finished"]\n{\n    margin: 1em .5em;\n}\n\n\n[part="is-finished"]:checked + slot [part="description"]\n,[part="is-finished"]:checked + ::slotted([slot="description"])\n{\n    text-decoration: line-through;\n}\n\n[part="description"]\n{\n    /* user-agent input defaults */\n    --input-border-color: rgb(118, 118, 118);\n\n    min-height: 1.2em;\n    min-width: 20ch;\n    resize: both;\n    background-color: field;\n    color: fieldtext;\n    border: solid 1px var(--input-border-color, fieldtext);\n    padding: 3px 5px;\n    font-size: 12px;\n    font-family: sans-serif;\n    display: block;\n    border-radius: 2px;\n\n}\n@media (prefers-color-scheme: dark) \n{\n    :host\n    {\n        /* user-agent input defaults */\n        --input-border-color: rgb(133, 133, 133);\n    }\n}\n\n[part="description"]\n,::slotted([slot="description"])\n{\n    margin: 1em .5em 1em 0;\n    flex: 1;\n}\n\n[part="remove-button"]\n{\n    display: inline-flex;\n    align-items: center;\n    justify-content: center;\n    margin:1em .5em 1em 0;\n}\n[part="remove-icon"]\n{\n    width: var(--icon-width, var(--icon-size, 12px));\n    height: var(--icon-height, var(--icon-size, 12px));\n}';
var task_card_default2 = '<slot name="handle">\n    <span part="handle"></span>\n</slot>\n<span part="color-container">\n    <input type="color" part="color" value="#919191" />\n</span>\n<input type="checkbox" part="is-finished" title="Finished?" />\n<slot name="description"><div part="description" contenteditable="true"></div></slot>\n<button type="button" part="remove-button" title="Delete">\n    <slot name="remove-button-label">\n        <svg part="remove-icon" class="icon close-cross" viewBox="0 0 22.812714 22.814663" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">\n            <path\n            style="display:inline;fill:var(--icon-primary-color,InfoText);fill-opacity:1;stroke:var(--icon-secondary-color,InfoBackground);stroke-width:1;stroke-linecap:round;stroke-dasharray:none;stroke-opacity:1"\n            d="m 3.8656768,2.2287478 a 1.6392814,1.6392814 0 0 0 -1.15929,0.48032 1.6392814,1.6392814 0 0 0 0,2.31816 l 6.38181,6.3818002 -6.38181,6.38182 a 1.6392814,1.6392814 0 0 0 0,2.31814 1.6392814,1.6392814 0 0 0 2.31816,0 l 6.3818102,-6.3818 6.38181,6.3818 a 1.6392814,1.6392814 0 0 0 2.31816,0 1.6392814,1.6392814 0 0 0 0,-2.31814 l -6.38182,-6.38182 6.38182,-6.3818002 a 1.6392814,1.6392814 0 0 0 0,-2.31816 1.6392814,1.6392814 0 0 0 -1.15929,-0.48032 1.6392814,1.6392814 0 0 0 -1.15887,0.48032 l -6.38181,6.38181 -6.3818102,-6.38181 a 1.6392814,1.6392814 0 0 0 -1.15887,-0.48032 z" />\n        </svg>\n    </slot>\n</button>';
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(task_card_default);
var COMPONENT_TAG_NAME = "task-card";
var TaskCardElement = class extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  /**
   * Query for a part in the element's shadow DOM and then caches it so that the next time this function is called, the cached element can be provided.
   * @param key the part value of the child element to query for
   * @returns the requested `HTMLElement` or `undefined`
   */
  getPart(key) {
    if (this.componentParts.get(key) == null) {
      const part = this.shadowRoot.querySelector(`[part="${key}"]`);
      if (part != null) {
        this.componentParts.set(key, part);
      }
    }
    return this.componentParts.get(key);
  }
  /**
   * Query for a part in the element's shadow DOM
   * @param key the part value of the child element to query for
   * @returns the requested `HTMLElement` or `undefined`
   */
  findPart(key) {
    return this.shadowRoot.querySelector(`[part="${key}"]`);
  }
  get value() {
    return this.findPart("description").textContent;
  }
  #previousValue = null;
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = task_card_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.findPart("color").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change", { detail: { target: event.target } }));
    });
    this.findPart("is-finished").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change", { detail: { target: event.target } }));
    });
    this.findPart("description").addEventListener("blur", (event) => {
      if (this.value != this.#previousValue) {
        this.dispatchEvent(new CustomEvent("change", { detail: { target: event.target } }));
      }
      this.#previousValue = this.value;
    });
    this.findPart("remove-button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("remove"));
    });
  }
  static create(props) {
    const element = document.createElement(COMPONENT_TAG_NAME);
    if (props == null) {
      return element;
    }
    for (const [key, value] of Object.entries(props)) {
      if (key == "value" || key == "placeholder" || key == "color") {
        element.setAttribute(key, value);
      } else if (key.startsWith("on")) {
        const eventName = key.substring(2).toLowerCase();
        element.addEventListener(eventName, value);
      }
    }
    return element;
  }
  static observedAttributes = ["value", "description", "color", "is-finished"];
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName == "value" || attributeName == "description") {
      this.findPart("description").textContent = newValue;
    } else if (attributeName == "is-finished") {
      this.findPart("is-finished").checked = newValue == "true";
    } else if (attributeName == "color") {
      this.findPart("color").value = newValue;
    }
  }
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, TaskCardElement);
}

// task-list.ts
var COMPONENT_STYLESHEET2 = new CSSStyleSheet();
COMPONENT_STYLESHEET2.replaceSync(task_list_default);
var TaskListEvents = /* @__PURE__ */ ((TaskListEvents2) => {
  TaskListEvents2["Change"] = "change";
  TaskListEvents2["Add"] = "add";
  TaskListEvents2["Collapse"] = "collapse";
  return TaskListEvents2;
})(TaskListEvents || {});
var COMPONENT_TAG_NAME2 = "task-list";
var TaskListElement = class extends HTMLElement {
  componentParts = /* @__PURE__ */ new Map();
  getPart(key) {
    if (this.componentParts.get(key) == null) {
      const part = this.shadowRoot.querySelector(`[part="${key}"]`);
      if (part != null) {
        this.componentParts.set(key, part);
      }
    }
    return this.componentParts.get(key);
  }
  findPart(key) {
    return this.shadowRoot.querySelector(`[part="${key}"]`);
  }
  handledItems = /* @__PURE__ */ new WeakSet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = task_list_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET2);
    this.findPart("name").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change", { detail: { target: event.target } }));
    });
    this.findPart("color").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change", { detail: { target: event.target } }));
    });
    this.findPart("collapse-button").addEventListener("click", () => {
      this.toggleHidden();
    });
    this.findPart("add-button").addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("add", { bubbles: true, detail: { order: this.childNodes.length, type: "request" } }));
    });
    this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", (event) => {
      const children = event.target.assignedElements();
      for (let i = 0; i < children.length; i++) {
        if (this.handledItems.has(children[i])) {
          continue;
        }
        if (this.getAttribute("drag-drop") != null && children[i].tagName.toLowerCase() == COMPONENT_TAG_NAME.toLowerCase()) {
          const taskCard = children[i];
          taskCard.draggable = true;
          this.handledItems.add(children[i]);
          continue;
        }
        if (children[i].tagName.toLowerCase() == COMPONENT_TAG_NAME2.toLowerCase()) {
          this.dispatchEvent(new CustomEvent("nested", { bubbles: true, detail: { target: children[i] } }));
          this.handledItems.add(children[i]);
        }
        if (children[i].tagName.toLowerCase() == COMPONENT_TAG_NAME.toLowerCase()) {
          this.dispatchEvent(new CustomEvent("added", { bubbles: true, detail: { order: this.childNodes.length, target: children[i] } }));
          this.handledItems.add(children[i]);
        }
      }
    });
  }
  static create(props) {
    const element = document.createElement(COMPONENT_TAG_NAME2);
    if (props == null) {
      return element;
    }
    for (const [key, value] of Object.entries(props)) {
      if (this.observedAttributes.indexOf(key) > -1) {
        element.setAttribute(key, value);
      } else if (key == "items") {
      }
    }
    return element;
  }
  toggleHidden() {
    if (this.getAttribute("collapsed") == null) {
      this.hide();
    } else {
      this.show();
    }
  }
  hide() {
    this.findPart("collapse-button").textContent = "\u25BC";
    this.setAttribute("collapsed", "");
    this.dispatchEvent(new CustomEvent("collapse"));
  }
  show() {
    this.findPart("collapse-button").textContent = "\u25B2";
    this.removeAttribute("collapsed");
    this.dispatchEvent(new CustomEvent("collapse"));
  }
  static observedAttributes = ["name", "description", "color", "collapsed"];
  attributeChangedCallback(attributeName, _oldValue, newValue) {
    if (attributeName == "name") {
      this.findPart("name").value = newValue;
    } else if (attributeName == "description") {
      this.findPart("header").title = newValue;
    } else if (attributeName == "color") {
      this.findPart("color").value = newValue;
    } else if (attributeName == "collapsed") {
      if (newValue === "true") {
        this.classList.add("collapsed");
      } else {
        this.classList.remove("collapsed");
      }
    }
  }
};
if (customElements.get(COMPONENT_TAG_NAME2) == null) {
  customElements.define(COMPONENT_TAG_NAME2, TaskListElement);
}
export {
  COMPONENT_TAG_NAME2 as COMPONENT_TAG_NAME,
  TaskListElement,
  TaskListEvents
};
