// task-list.css?raw
var task_list_default = ':host\r\n{\r\n    --border-color: rgb(95, 95, 95);\r\n    display: inline-block;\r\n    border: solid 1px var(--border-color);\r\n    border-radius: 3px;\r\n    padding: .5em;\r\n}\r\n@media (prefers-color-scheme: dark) \r\n{\r\n    :host\r\n    {\r\n        --border-color: rgb(71, 71, 71);\r\n    }\r\n}\r\n\r\n\r\n[part="header"]\r\n{\r\n    display: grid;\r\n    grid-template-columns: auto minmax(0, 1fr) auto;\r\n    align-items: center;\r\n    position: sticky;\r\n}\r\n\r\n[part="color-container"]\r\n{\r\n    display: contents;\r\n}\r\n\r\n[part="color"]\r\n{\r\n    padding: 0;\r\n    width: 12px;\r\n    min-height: 0;\r\n    height: auto;\r\n    border: solid 1px transparent;\r\n    align-self: stretch;\r\n}\r\n[part="color"]::-moz-color-swatch \r\n{\r\n    border: none;\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n[part="color"]::-webkit-color-swatch-wrapper \r\n{\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n[part="color"]::-webkit-color-swatch \r\n{\r\n    border: none;\r\n    padding: 0;\r\n    margin: 0;\r\n}\r\n\r\n[part="tasks"]\r\n{\r\n    list-style: none;\r\n    margin: 0;\r\n    padding: 0;\r\n    display: flex;\r\n    flex-direction: column;\r\n}\r\n\r\n[part="add-button"]\r\n{\r\n    margin-top: 1rem;\r\n    margin-inline: auto;\r\n    min-width: 100px;\r\n    align-self: center;\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: center;\r\n    gap: 5px;\r\n}\r\n\r\n:host([collapsed]) > [part="tasks"]\r\n{\r\n    overflow: hidden;\r\n    height: min-content;\r\n    height: 0;\r\n    opacity: 0;\r\n    white-space: nowrap;\r\n    padding: 0;\r\n    margin: 0;\r\n    border: none;\r\n    pointer-events: none;\r\n    user-select: none;\r\n}\r\n\r\n::slotted([data-drag-id])\r\n{\r\n    opacity: .7;\r\n    scale: .97;\r\n    transition: opacity 100ms ease, scale 100ms ease;\r\n}\r\n\r\n::slotted(task-list)\r\n{\r\n    margin-block: 7px;\r\n}';

// task-list.html?raw
var task_list_default2 = '<slot name="header">\r\n    <header part="header">\r\n        <label part="color-container" title="Color">\r\n            <input type="color" part="color" value="#919191" />\r\n        </label>\r\n        <input type="text" part="name" placeholder="List Name" />\r\n        <button type="button" part="collapse-button" title="Collapse">\r\n            <span part="collapse-icon">\u25B2</span>\r\n        </button>\r\n    </header>\r\n</slot>\r\n<ul part="tasks">\r\n    <slot></slot>\r\n</ul>\r\n<slot name="add-button"><button type="button" part="add-button" title="Add">\r\n    <span part="add-icon">&plus;</span>\r\n    <span part="add-label">Add Task</span>\r\n</button></slot>\r\n<slot name="footer"></slot>';

// task-list.ts
var COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(task_list_default);
var TaskListEvents = /* @__PURE__ */ ((TaskListEvents2) => {
  TaskListEvents2["Change"] = "change";
  TaskListEvents2["Add"] = "add";
  TaskListEvents2["Added"] = "added";
  TaskListEvents2["Removed"] = "removed";
  TaskListEvents2["Nested"] = "nested";
  TaskListEvents2["Collapse"] = "collapse";
  return TaskListEvents2;
})(TaskListEvents || {});
var COMPONENT_TAG_NAME = "task-list";
var TaskListElement = class extends HTMLElement {
  TASKCARD_TAG_NAME = "task-card";
  dragAndDropQueryParent;
  parentScopeSelector = "";
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
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.dragAndDropQueryParent = document.body;
    this.findPart("name").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change" /* Change */, { bubbles: true, cancelable: true, detail: { target: event.target } }));
    });
    this.findPart("color").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change" /* Change */, { bubbles: true, cancelable: true, detail: { target: event.target } }));
    });
    this.findPart("collapse-button").addEventListener("click", () => {
      this.toggleHidden();
    });
    this.findPart("add-button").addEventListener("click", () => {
      const order = this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`).length;
      this.dispatchEvent(new CustomEvent("add" /* Add */, { bubbles: true, cancelable: true, detail: { order } }));
    });
    if (this.getAttribute("drag-drop") != null) {
      this.#applyDragAndDropHandlers();
    }
    this.shadowRoot.querySelector("slot:not([name])").addEventListener("slotchange", (event) => {
      const children = event.target.assignedElements();
      for (let i = 0; i < children.length; i++) {
        if (this.handledItems.has(children[i])) {
          continue;
        }
        if (children[i].tagName.toLowerCase() == COMPONENT_TAG_NAME.toLowerCase()) {
          this.dispatchEvent(new CustomEvent("nested" /* Nested */, { bubbles: true, cancelable: true, detail: { target: children[i] } }));
          this.handledItems.add(children[i]);
        }
        if (children[i].tagName.toLowerCase() == this.TASKCARD_TAG_NAME.toLowerCase()) {
          this.handledItems.add(children[i]);
        }
        if (this.getAttribute("drag-drop") != null) {
          this.applyDragAndDropCardHandler(children[i]);
        }
      }
    });
  }
  toggleHidden() {
    if (this.getAttribute("collapsed") == null) {
      this.hide();
    } else {
      this.show();
    }
  }
  hide() {
    this.findPart("collapse-icon").textContent = "\u25BC";
    this.setAttribute("collapsed", "");
    this.dispatchEvent(new CustomEvent("collapse" /* Collapse */, { bubbles: true, cancelable: true }));
  }
  show() {
    this.findPart("collapse-icon").textContent = "\u25B2";
    this.removeAttribute("collapsed");
    this.dispatchEvent(new CustomEvent("collapse" /* Collapse */, { bubbles: true, cancelable: true }));
  }
  static observedAttributes = ["name", "description", "color", "collapsed", "drag-drop"];
  attributeChangedCallback(attributeName, oldValue, newValue) {
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
    } else if (attributeName == "drag-drop" && oldValue == null) {
      this.#applyDragAndDropHandlers();
    }
  }
  #applyDragAndDropHandlers() {
    this.addEventListener("dragover", (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.effectAllowed = "move";
      const tasks = [...this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}:not([data-drag-id])`)];
      const nextElement = tasks.reduce((closest, task) => {
        const boundingRect = task.getBoundingClientRect();
        const offset = event.clientY - boundingRect.top - boundingRect.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, task };
        }
        return closest;
      }, { offset: Number.NEGATIVE_INFINITY, task: void 0 }).task;
      const target = this.dragAndDropQueryParent.querySelector(`${this.parentScopeSelector}${this.TASKCARD_TAG_NAME}[data-drag-id]`);
      if (target == null || target.parentElement == this && nextElement == target.nextElementSibling) {
        return;
      }
      if (nextElement == null || this.getAttribute("collapsed") != null) {
        this.append(target);
      } else {
        this.insertBefore(target, nextElement);
      }
    });
    this.addEventListener("drop", (event) => {
      event.preventDefault();
      event.stopPropagation();
      return false;
    });
    const childItems = [...this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`)];
    for (let i = 0; i < childItems.length; i++) {
      this.applyDragAndDropCardHandler(childItems[i]);
    }
  }
  applyDragAndDropCardHandler(taskCard) {
    taskCard.setAttribute("draggable", "true");
    taskCard.addEventListener("dragstart", this.#boundEventHandlers.item_onDragStart);
    taskCard.addEventListener("dragend", this.#boundEventHandlers.item_onDragEnd);
  }
  #item_onDragStart(event) {
    const taskCard = event.currentTarget;
    const dragId = this.#createDragId();
    const childItems = [...this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`)];
    const order = childItems.indexOf(taskCard);
    taskCard.dataset.dragId = dragId;
    taskCard.dataset.order = order.toString();
    taskCard.previousParent = this;
  }
  /**
   * A function to generate an id for identifying the task that
   * is currently being dragged.
   * @returns a random `number` between 0 and 1000;
   */
  #createDragId() {
    return Math.floor(Math.random() * 1e3).toString();
  }
  #item_onDragEnd(event) {
    event.preventDefault();
    const taskCard = event.currentTarget;
    const previousOrder = parseInt(taskCard.dataset.order ?? "");
    const previousParent = taskCard.previousParent;
    const currentParent = taskCard.parentElement;
    const childItems = [...currentParent.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`)];
    const order = childItems.indexOf(taskCard);
    if (previousParent != currentParent) {
      currentParent.applyDragAndDropCardHandler(taskCard);
      currentParent.handledItems.add(taskCard);
      currentParent.dispatchEvent(new CustomEvent("added" /* Added */, { bubbles: true, detail: { order, target: taskCard } }));
      taskCard.removeEventListener("dragstart", previousParent.#boundEventHandlers.item_onDragStart);
      taskCard.removeEventListener("dragend", previousParent.#boundEventHandlers.item_onDragEnd);
      previousParent.handledItems.delete(taskCard);
      previousParent.dispatchEvent(new CustomEvent("removed" /* Removed */, { bubbles: true, detail: { order: previousOrder, target: taskCard } }));
    } else {
      currentParent.dispatchEvent(new CustomEvent("change" /* Change */, { bubbles: true, detail: { order, previousOrder, target: taskCard } }));
    }
    delete taskCard.dataset.dragId;
    delete taskCard.dataset.order;
    delete taskCard.previousParent;
  }
  #boundEventHandlers = {
    item_onDragStart: this.#item_onDragStart.bind(this),
    item_onDragEnd: this.#item_onDragEnd.bind(this)
  };
};
if (customElements.get(COMPONENT_TAG_NAME) == null) {
  customElements.define(COMPONENT_TAG_NAME, TaskListElement);
}
export {
  COMPONENT_TAG_NAME,
  TaskListElement,
  TaskListEvents
};
