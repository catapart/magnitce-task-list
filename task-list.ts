import style from './task-list.css?raw';
import html from './task-list.html?raw';

import '@magnit-ce/task-card';
import { TaskCardElement, COMPONENT_TAG_NAME as TASKCARD_TAG_NAME } from '@magnit-ce/task-card';

const COMPONENT_STYLESHEET = new CSSStyleSheet();
COMPONENT_STYLESHEET.replaceSync(style);


export type TaskListAttributes = 
{
    name?: string,
    description?: string,
    collapsed?: boolean,
};

export type TaskListProperties = TaskListAttributes &
{
    items?: TaskCardElement[],
};

export enum TaskListEvents
{
    Change = 'change',
    Add = 'add',
    Collapse = 'collapse'
};


export const COMPONENT_TAG_NAME = 'task-list';
export class TaskListElement extends HTMLElement
{

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

        this.findPart('name').addEventListener('change', (event) =>
        {
            this.dispatchEvent(new CustomEvent('change', { detail: { target: event.target }}));
        });
        this.findPart('color').addEventListener('change', (event) =>
        {
            this.dispatchEvent(new CustomEvent('change', { detail: { target: event.target }}));
        });

        this.findPart('collapse-button').addEventListener('click', () =>
        {
            this.toggleHidden();
        });

        this.findPart('add-button').addEventListener('click', () =>
        {
            this.dispatchEvent(new CustomEvent('add', { bubbles: true, detail: { order: this.childNodes.length, type: 'request' } }));
        });

        
        this.shadowRoot!.querySelector('slot:not([name])')!.addEventListener('slotchange', (event) =>
        {
            const children = (event.target as HTMLSlotElement).assignedElements();
            for(let i = 0; i < children.length; i++)
            {
                if(this.handledItems.has(children[i]))
                {
                    continue;
                }
                if(this.getAttribute('drag-drop') != null && children[i].tagName.toLowerCase() == TASKCARD_TAG_NAME.toLowerCase())
                {
                    const taskCard = children[i] as HTMLElement;
                    taskCard.draggable = true;
                    this.handledItems.add(children[i]);
                    continue;
                }
                if(children[i].tagName.toLowerCase() == COMPONENT_TAG_NAME.toLowerCase())
                {
                    this.dispatchEvent(new CustomEvent('nested', { bubbles: true, detail: { target: children[i] } }));
                    this.handledItems.add(children[i]);
                }
                if(children[i].tagName.toLowerCase() == TASKCARD_TAG_NAME.toLowerCase())
                {
                    this.dispatchEvent(new CustomEvent('added', { bubbles: true, detail: { order: this.childNodes.length, target: children[i] } }));
                    this.handledItems.add(children[i]);
                }

            }
        });
    }

    static create(props?: TaskListProperties)
    {
        const element = document.createElement(COMPONENT_TAG_NAME) as TaskListElement;
        if(props == null) { return element; }        

        for(const [key, value] of Object.entries(props))
        {
            if(this.observedAttributes.indexOf(key) > -1)
            {
                element.setAttribute(key, value as string)
            }
            else if(key == 'items')
            {
                //todo: add items
            }
            //   else if(key.startsWith('on'))
            //   {
            //     const eventName = key.substring(2).toLowerCase();
            //     element.addEventListener(eventName, value as (event: Event) => void|Promise<void>);
            //   }
        }
        return element;
    }

    toggleHidden()
    {
        if(this.getAttribute('collapsed') == null) { this.hide(); }
        else { this.show(); }
    }

    hide()
    {
        this.findPart('collapse-button').textContent = '▼';
        this.setAttribute('collapsed', '');
        this.dispatchEvent(new CustomEvent('collapse'));
    }
    show()
    {
        this.findPart('collapse-button').textContent = '▲';
        this.removeAttribute('collapsed');
        this.dispatchEvent(new CustomEvent('collapse'));
    }

    

    static observedAttributes = [ 'name', 'description', 'color', 'collapsed', ];
    attributeChangedCallback(attributeName: string, _oldValue: string, newValue: string) 
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
    }
}
if(customElements.get(COMPONENT_TAG_NAME) == null)
{
    customElements.define(COMPONENT_TAG_NAME, TaskListElement);
}