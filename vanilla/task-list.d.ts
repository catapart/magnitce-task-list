import { TaskCardElement } from '@magnit-ce/task-card';

type TaskListAttributes = {
    name?: string;
    description?: string;
    collapsed?: boolean;
};
type TaskListProperties = TaskListAttributes & {
    items?: TaskCardElement[];
};
declare enum TaskListEvents {
    Change = "change",
    Add = "add",
    Collapse = "collapse"
}
declare const COMPONENT_TAG_NAME = "task-list";
declare class TaskListElement extends HTMLElement {
    componentParts: Map<string, HTMLElement>;
    getPart<T extends HTMLElement = HTMLElement>(key: string): T;
    findPart<T extends HTMLElement = HTMLElement>(key: string): T;
    handledItems: WeakSet<Element>;
    constructor();
    static create(props?: TaskListProperties): TaskListElement;
    toggleHidden(): void;
    hide(): void;
    show(): void;
    static observedAttributes: string[];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string): void;
}

export { COMPONENT_TAG_NAME, type TaskListAttributes, TaskListElement, TaskListEvents, type TaskListProperties };
