// task-list.css?raw
var task_list_default = ":host\n{\n    --border-color: rgb(95, 95, 95);\n    display: inline-block;\n    border: solid 1px var(--border-color);\n    border-radius: 3px;\n    padding: .5em;\n}\n:host:has(#name:focus)\n{\n    outline: var(--list-name-focus-outline);\n}\n\n@media (prefers-color-scheme: dark) \n{\n    :host\n    {\n        --border-color: rgb(71, 71, 71);\n    }\n}\n\n\n#header\n{\n    display: grid;\n    grid-template-columns: auto minmax(0, 1fr) auto;\n    align-items: center;\n    position: sticky;\n}\n\n#color-container\n{\n    display: contents;\n}\n\n#color\n{\n    padding: 0;\n    width: 12px;\n    min-height: 0;\n    height: auto;\n    border: solid 1px transparent;\n    align-self: stretch;\n}\n#color::-moz-color-swatch \n{\n    border: none;\n    padding: 0;\n    margin: 0;\n}\n\n#color::-webkit-color-swatch-wrapper \n{\n    padding: 0;\n    margin: 0;\n}\n\n#color::-webkit-color-swatch \n{\n    border: none;\n    padding: 0;\n    margin: 0;\n}\n\n#tasks\n{\n    list-style: none;\n    margin: 0;\n    padding: 0;\n    display: flex;\n    flex-direction: column;\n}\n\n#add-button\n{\n    margin-top: 1rem;\n    margin-inline: auto;\n    min-width: 100px;\n    align-self: center;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    gap: 5px;\n}\n\n:host([collapsed]) > #tasks\n{\n    overflow: hidden;\n    height: min-content;\n    height: 0;\n    opacity: 0;\n    padding: 0;\n    margin: 0;\n    border: none;\n    pointer-events: none;\n    user-select: none;\n}\n\n::slotted([data-drag-id])\n{\n    opacity: .7;\n    scale: .97;\n    transition: opacity 100ms ease, scale 100ms ease;\n}\n\n::slotted(task-list)\n{\n    margin-block: 7px;\n}";

// task-list.html?raw
var task_list_default2 = '<slot name="header">\n    <header id="header">\n        <label id="color-container" title="Color">\n            <input type="color" id="color" class="input" value="#919191" />\n        </label>\n        <input type="text" id="name" class="input" placeholder="List Name" />\n        <button type="button" id="collapse-button" class="button field-button" title="Collapse">\n            <span id="collapse-icon" class="icon">\u25B2</span>\n        </button>\n    </header>\n</slot>\n<ul id="tasks">\n    <slot></slot>\n</ul>\n<slot name="add-button">\n<button type="button" id="add-button" class="button" title="Add">\n    <span id="add-icon" class="icon">&plus;</span>\n    <span id="add-label">Add Task</span>\n</button>\n</slot>\n<slot name="footer"></slot>';

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
  getElement(id) {
    if (this.componentParts.get(id) == null) {
      const part = this.findElement(id);
      if (part != null) {
        this.componentParts.set(id, part);
      }
    }
    return this.componentParts.get(id);
  }
  findElement(id) {
    return this.shadowRoot.getElementById(id);
  }
  handledItems = /* @__PURE__ */ new WeakSet();
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = task_list_default2;
    this.shadowRoot.adoptedStyleSheets.push(COMPONENT_STYLESHEET);
    this.dragAndDropQueryParent = this.parentElement == null ? this.getRootNode() : this.parentElement.getRootNode();
    this.findElement("name").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change" /* Change */, { bubbles: true, cancelable: true, detail: { target: event.target } }));
    });
    this.findElement("color").addEventListener("change", (event) => {
      this.dispatchEvent(new CustomEvent("change" /* Change */, { bubbles: true, cancelable: true, detail: { target: event.target } }));
    });
    this.findElement("collapse-button").addEventListener("click", () => {
      this.toggleHidden();
    });
    this.findElement("add-button").addEventListener("click", () => {
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
        if (children[i].tagName.toLowerCase() == this.TASKCARD_TAG_NAME.toLowerCase() && children[i].dataset.dragId == null) {
          this.handledItems.add(children[i]);
          if (this.getAttribute("drag-drop") != null) {
            this.applyDragAndDropCardHandler(children[i]);
          }
        }
      }
    });
    this.#applyPartAttributes();
  }
  #applyPartAttributes() {
    const identifiedElements = [...this.shadowRoot.querySelectorAll("[id]")];
    for (let i = 0; i < identifiedElements.length; i++) {
      identifiedElements[i].part.add(identifiedElements[i].id);
    }
    const classedElements = [...this.shadowRoot.querySelectorAll("[class]")];
    for (let i = 0; i < classedElements.length; i++) {
      classedElements[i].part.add(...classedElements[i].classList);
    }
  }
  toggleHidden() {
    if (this.getAttribute("collapsed") == null) {
      this.hide();
    } else {
      this.show();
    }
  }
  hide() {
    this.findElement("collapse-icon").textContent = "\u25BC";
    this.setAttribute("collapsed", "");
    this.dispatchEvent(new CustomEvent("collapse" /* Collapse */, { bubbles: true, cancelable: true }));
  }
  show() {
    this.findElement("collapse-icon").textContent = "\u25B2";
    this.removeAttribute("collapsed");
    this.dispatchEvent(new CustomEvent("collapse" /* Collapse */, { bubbles: true, cancelable: true }));
  }
  static observedAttributes = ["name", "description", "color", "collapsed", "drag-drop"];
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (attributeName == "name") {
      this.findElement("name").value = newValue;
    } else if (attributeName == "description") {
      this.findElement("header").title = newValue;
    } else if (attributeName == "color") {
      this.findElement("color").value = newValue;
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
    taskCard.dataset.listIndex = [...this.parentElement.children].indexOf(this).toString();
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
    event.stopPropagation();
    const taskCard = event.currentTarget;
    const previousOrder = parseInt(taskCard.dataset.order ?? "");
    const previousParent = this.parentElement.children[parseInt(taskCard.dataset.listIndex)];
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
