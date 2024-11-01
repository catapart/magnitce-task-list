import style from './task-list.css?raw';
import html from './task-list.html?raw';

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);


export type TaskListAttributes = 
{
    name?: string,
    description?: string,
    color?: string,
    collapsed?: boolean,
};

export enum TaskListEvents
{
    Change = 'change',
    Add = 'add',
    Added = 'added',
    Removed = 'removed',
    Nested = 'nested',
    Collapse = 'collapse'
};


export const COMPONENT_TAG_NAME = 'task-list';
export class TaskListElement extends HTMLElement
{
    TASKCARD_TAG_NAME: string = 'task-card';

    dragAndDropQueryParent: Document|ShadowRoot|HTMLElement;
    parentScopeSelector: string = '';

    componentParts: Map<string, HTMLElement> = new Map();
    getPart<T extends HTMLElement = HTMLElement>(key: string)
    {
        if(this.componentParts.get(key) == null)
        {
            const part = this.shadowRoot!.querySelector(`[part="${key}"]`) as HTMLElement;
            if(part != null) { this.componentParts.set(key, part); }
        }

        return this.componentParts.get(key) as T;
    }
    findPart<T extends HTMLElement = HTMLElement>(key: string) { return this.shadowRoot!.querySelector(`[part="${key}"]`) as T; }

    handledItems: WeakSet<Element> = new WeakSet();

    constructor()
    {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = html;
        this.shadowRoot!.adoptedStyleSheets.push(COMPONENT_STYLESHEET);

        this.dragAndDropQueryParent = (this.parentElement == null) ? this.getRootNode() as Document|ShadowRoot : this.parentElement.getRootNode() as Document|ShadowRoot;

        this.findPart('name').addEventListener('change', (event) =>
        {
            this.dispatchEvent(new CustomEvent(TaskListEvents.Change, { bubbles: true, cancelable: true, detail: { target: event.target }}));
        });
        this.findPart('color').addEventListener('change', (event) =>
        {
            this.dispatchEvent(new CustomEvent(TaskListEvents.Change, { bubbles: true, cancelable: true, detail: { target: event.target }}));
        });

        this.findPart('collapse-button').addEventListener('click', () =>
        {
            this.toggleHidden();
        });

        this.findPart('add-button').addEventListener('click', () =>
        {
            const order = this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`).length;
            this.dispatchEvent(new CustomEvent(TaskListEvents.Add, { bubbles: true, cancelable: true, detail: { order } }));
        });


        if(this.getAttribute('drag-drop') != null)
        {
            this.#applyDragAndDropHandlers();
        }
        
        this.shadowRoot!.querySelector('slot:not([name])')!.addEventListener('slotchange', (event) =>
        {
            const children = (event.target as HTMLSlotElement).assignedElements();
            for(let i = 0; i < children.length; i++)
            {
                if(this.handledItems.has(children[i]))
                {
                    continue;
                }
                if(children[i].tagName.toLowerCase() == COMPONENT_TAG_NAME.toLowerCase())
                {
                    this.dispatchEvent(new CustomEvent(TaskListEvents.Nested, { bubbles: true, cancelable: true, detail: { target: children[i] } }));
                    this.handledItems.add(children[i]);
                }
                if(children[i].tagName.toLowerCase() == this.TASKCARD_TAG_NAME.toLowerCase())
                {
                    this.handledItems.add(children[i]);
                    if(this.getAttribute('drag-drop') != null)
                    {
                        this.applyDragAndDropCardHandler(children[i] as HTMLElement);
                    }
                }
            }
        });
    }

    toggleHidden()
    {
        if(this.getAttribute('collapsed') == null) { this.hide(); }
        else { this.show(); }
    }

    hide()
    {
        this.findPart('collapse-icon').textContent = '▼';
        this.setAttribute('collapsed', '');
        this.dispatchEvent(new CustomEvent(TaskListEvents.Collapse, { bubbles: true, cancelable: true }));
    }
    show()
    {
        this.findPart('collapse-icon').textContent = '▲';
        this.removeAttribute('collapsed');
        this.dispatchEvent(new CustomEvent(TaskListEvents.Collapse, { bubbles: true, cancelable: true }));
    }

    

    static observedAttributes = [ 'name', 'description', 'color', 'collapsed', 'drag-drop'];
    attributeChangedCallback(attributeName: string, oldValue: string, newValue: string) 
    {  
    // console.log(attributeName, oldValue, newValue);

        if(attributeName == 'name')
        {
            this.findPart<HTMLInputElement>('name').value = newValue;
        }
        else if(attributeName == 'description')
        {
            this.findPart('header').title = newValue;
        }
        else if(attributeName == 'color')
        {
            this.findPart<HTMLInputElement>('color').value = newValue;
        }
        else if(attributeName == 'collapsed')
        {
            if(newValue === 'true')
            {
                this.classList.add('collapsed');
            }
            else
            {
                this.classList.remove('collapsed');
            }
        }
        else if(attributeName == 'drag-drop' && oldValue == null)
        {
            this.#applyDragAndDropHandlers();
        }
    }

    #applyDragAndDropHandlers()
    {
        // event fires whenever a draggable item is over the tasklist
        // multiple times per second, if mouse is dragging
        this.addEventListener('dragover', (event: DragEvent) =>
        {
            // default behavior is to disallow dragging; prevent that
            event.preventDefault();
            event.stopPropagation();

            // define what kinds of effects are allowed for this drag
            event.dataTransfer!.effectAllowed = "move";

            // get the next element in the list, if there 
            // are any, based on the mouse position;
            const tasks = [...this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}:not([data-drag-id])`)];
            const nextElement: any = tasks.reduce((closest, task) =>
            {
                const boundingRect = task.getBoundingClientRect();
                const offset = event.clientY - boundingRect.top - (boundingRect.height / 2);
                if(offset < 0 && offset > closest.offset)
                {
                    return { offset, task };
                }
                return closest as any;
            }, { offset: Number.NEGATIVE_INFINITY, task: undefined }).task;

            // get a reference to the card being dragged
            const target = this.dragAndDropQueryParent.querySelector(`${this.parentScopeSelector}${this.TASKCARD_TAG_NAME}[data-drag-id]`)!;

            // prevent unecessary re-renders; this can kill perf, if you don't guard here;
            // re-rendering by appending or inserting on every mouse-move is heavy;
            if(target == null || target.parentElement == this && nextElement == target.nextElementSibling){ return; }


            // if there is no next element
            // or the list is collapsed, add the task to the end of the list
            if(nextElement == null || this.getAttribute('collapsed') != null)
            {
                this.append(target);
            }
            else
            {
                // otherwise, insert the task before the next task in the list
                this.insertBefore(target, nextElement);
            }
        });
        this.addEventListener('drop', (event) =>
        {
            // if you don't prevent default
            // you can end up "dropping" into an
            // input element, which causes unwanted
            // side effects, based on the drag data
            event.preventDefault();
            event.stopPropagation();
            return false;
        });

        
        const childItems = [...this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`)] as HTMLElement[];
        for(let i = 0; i < childItems.length; i++)
        {
            this.applyDragAndDropCardHandler(childItems[i]);
        }
    }
    applyDragAndDropCardHandler(taskCard: HTMLElement)
    {
        taskCard.setAttribute('draggable', "true");
        taskCard.addEventListener('dragstart', this.#boundEventHandlers.item_onDragStart);
        taskCard.addEventListener('dragend', this.#boundEventHandlers.item_onDragEnd);
    }
    #item_onDragStart(event: Event|DragEvent)
    {
        const taskCard = event.currentTarget as HTMLElement;
        // create an identifier, so the lists can each find
        // this task. It allows them to easily handle this 
        // task differently than other tasks.
        const dragId = this.#createDragId();        
        const childItems = [...this.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`)];
        const order = childItems.indexOf(taskCard);
        taskCard.dataset.dragId = dragId;
        taskCard.dataset.order = order.toString();
        (taskCard as any).previousParent = this;
    }
    /**
     * A function to generate an id for identifying the task that
     * is currently being dragged.
     * @returns a random `number` between 0 and 1000;
     */
    #createDragId()
    {
        return Math.floor(Math.random() * 1000).toString();
    }
    #item_onDragEnd(event: Event|DragEvent)
    {
        event.preventDefault();

        const taskCard = event.currentTarget as HTMLElement;
        const previousOrder = parseInt(taskCard.dataset.order ?? "");

        const previousParent = (taskCard as any).previousParent as TaskListElement;
        const currentParent = taskCard.parentElement as TaskListElement;

        const childItems = [...currentParent.querySelectorAll(`:scope > ${this.TASKCARD_TAG_NAME}`)]
        const order = childItems.indexOf(taskCard);

        if(previousParent != currentParent)
        {
            currentParent.applyDragAndDropCardHandler(taskCard);
            currentParent.handledItems.add(taskCard);
            currentParent.dispatchEvent(new CustomEvent(TaskListEvents.Added, { bubbles: true, detail: { order, target: taskCard } }));

            taskCard.removeEventListener('dragstart', previousParent.#boundEventHandlers.item_onDragStart);
            taskCard.removeEventListener('dragend', previousParent.#boundEventHandlers.item_onDragEnd);
            previousParent.handledItems.delete(taskCard);
            previousParent.dispatchEvent(new CustomEvent(TaskListEvents.Removed, { bubbles: true, detail: { order: previousOrder, target: taskCard } }));
        }
        else
        {
            currentParent.dispatchEvent(new CustomEvent(TaskListEvents.Change, { bubbles: true, detail: { order, previousOrder, target: taskCard } }));
        }

        // revoke the drag properties, after the drag has ended
        delete taskCard.dataset.dragId;
        delete taskCard.dataset.order;
        delete (taskCard as any).previousParent;
    }

    #boundEventHandlers: { [key: string]:((event: Event|DragEvent) => void) } = {
        item_onDragStart: this.#item_onDragStart.bind(this),
        item_onDragEnd: this.#item_onDragEnd.bind(this),
    };
}
if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, TaskListElement);
}