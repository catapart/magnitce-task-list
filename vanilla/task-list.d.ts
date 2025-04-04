type TaskListAttributes = {
    name?: string;
    description?: string;
    color?: string;
    collapsed?: boolean;
};
declare enum TaskListEvents {
    Change = "change",
    Add = "add",
    Added = "added",
    Removed = "removed",
    Nested = "nested",
    Collapse = "collapse"
}
declare const COMPONENT_TAG_NAME = "task-list";
declare class TaskListElement extends HTMLElement {
    #private;
    TASKCARD_TAG_NAME: string;
    dragAndDropQueryParent: Document | ShadowRoot | HTMLElement;
    parentScopeSelector: string;
    componentParts: Map<string, HTMLElement>;
    getElement<T extends HTMLElement = HTMLElement>(id: string): T;
    findElement<T extends HTMLElement = HTMLElement>(id: string): T;
    handledItems: WeakSet<Element>;
    constructor();
    toggleHidden(): void;
    hide(): void;
    show(): void;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string): void;
    applyDragAndDropCardHandler(taskCard: HTMLElement): void;
}

export { COMPONENT_TAG_NAME, type TaskListAttributes, TaskListElement, TaskListEvents };
