# magnitce-task-list
A custom `HTMLElement` that provides features and events for managing custom [`<task-card>`](https://github.com/catapart/magnitce-task-card) elements.

Package size: ~11kb minified, ~14kb verbose.

## Quick Reference
```html
<task-list>
    <task-card value="Dishes" is-finished="true"></task-card>
    <task-card value="Laundry" color="#FF00FF"></task-card>
    <task-card value="Sweeping"></task-card>
    <task-card value="Cocktail (margarita:)">
        <textarea slot="description">
    1 part  lime juice
    1 part  orange liqueur (grand marnier/cointreau/triple sec/etc)
    3 parts tequila

    1 twist of lime peel
    1 tbsp rimming salt

    1/2 shaker of ice
    1 serving glass "on the rocks" (a serving amount of ice)

    combine lime juice, orange liquer, and tequila in shaker
    shake well for 10-20 seconds
    strain liquid into serving glass
    express oils from lime peel and wet serving glass rim with them
    apply rimming salt to wetted rim of glass
        </textarea>
    </task-card>
<task-list>
<script type="module" src="/path/to/task-list[.min].js"></script>
```

## Demos
https://catapart.github.io/magnitce-task-list/demo/

## Support
- Firefox
- Chrome
- Edge
- <s>Safari</s> (Has not been tested; should be supported, based on custom element support)

## Getting Started
 1. [Install/Reference the library](#referenceinstall)

### Reference/Install
#### HTML Import (not required for vanilla js/ts; alternative to import statement)
```html
<script type="module" src="/path/to/task-list[.min].js"></script>
```
#### npm
```cmd
npm install @magnit-ce/task-list
```

### Import
#### Vanilla js/ts
```js
import "/path/to/task-list[.min].js"; // if you didn't reference from a <script>, reference with an import like this

import { TaskCardElement, TaskListElement } from "/path/to/task-list[.min].js";
```
#### npm
```js
import "@magnit-ce/task-list"; // if you didn't reference from a <script>, reference with an import like this

import { TaskCardElement, TaskListElement } from "@magnit-ce/task-list";
```

---
---
---

## Overview
The `<task-list>` element is a container element for [`<task-card>`](https://github.com/catapart/magnitce-task-card) elements. It provides some basic task list features, like a customizeable header, an add button, the ability to show and hide its items, and a drag-and-drop feature. It also dispatches events when the list contents change.

## Attributes
|Attribute|Effect|
|-|-|
|`name`|Sets the title of the list. Displays as the value of the text input in the list header.|
|`description`|Sets the title text of the list's header. Displays as "title text". Visible upon hovering a pointer over the header.|
|`color`|A color to represent the list. Displays as the value of the color input in the list header. A categorization feature.|
|`collapsed`|If `true`, hides the list items. If `false`, displays the list items.|
|`drag-drop`|Enables drag-and-drop functionality for the list items.|

## Drag and Drop
The `<task-list>` element implements drag-and-drop features by using the native browser events `dragstart`, `dragend`, `dragover`, and `drop`. These events require non-trivial handlers, so the library expects [`<task-card>`](https://github.com/catapart/magnitce-task-card) elements as its list-items. While custom item types can be used, it is not recommended and may not have all of the features.

### `dragAndDropQueryParent` and `parentScopeSelector`
Facilitating moving items between lists means querying outside of the `<task-list>` elements, themselves.  
The `dragAndDropQueryParent` is an element which has a `querySelector()` function run on it to determine valid items for the drag target's (possible) siblings. In effect, this `dragAndDropQueryParent` is any element that contains all of the `<task-list>` elements which items will be able to be dragged-and-dropped between. By default, the `dragAndDropQueryParent` is set to the document's `<body>` element. This means that any `<task-list>` in the document will be considered as a drop target.  
To scope the query smaller, set the `dragAndDropQueryParent` to the first ancestor element that contains all of the `<task-list>` elements on your page.

The `parentScopeSelector` serves the same function as the `dragAndDropQueryParent`, but it is a string value that is used in the selector query. For reference, this is how the actual query looks:
```js
this.dragAndDropQueryParent.querySelector(`${this.parentScopeSelector}${this.TASKCARD_TAG_NAME}[data-drag-id]`);
```
From that snippet, you can see that the two features can actually work together, if you need to dynamically narrow scope from a larger parent scope. But the simplification of all of this is that you can use either an element reference, or a css selector, or both, as a away to scope the `<task-list>` elements when dragging and dropping.

### Customization
#### `[TaskListElement].TASKCARD_TAG_NAME`
The `TASKCARD_TAG_NAME` property of a `<task-list>` element determines the string that will be used to match "card" child elements. By default, this value is set to `<task-card>`, with the expectation of matching [`<task-card>`](https://github.com/catapart/magnitce-task-card) elements.  
To be clear: this is only referenced by the drag-and-drop functionality and can otherwise be ignored.

To use a custom list item, replace the `TASKCARD_TAG_NAME` with whatever the tag name is for the custom list item element.

## Parts
The `<task-list>` element uses the `part` attribute to expose its shadow DOM content to the light DOM both for styling and selecting in javascript.

|Part Name|Description|
|-|-|
|`header`|A `<header>` element containting inputs for the list's color and name, as well as a collapse button, and a `title` attribute set to the list's `description` property.|
|`color-container`|A container for the list's color input. May be used, with custom styling, to display the color while hiding the color input, itself.|
|`color`|An `<input type="color">` element that displays the list's `color` property.|
|`name`|An `<input type="text">` element that displays the list's `name` property.|
|`collapse-button`|A button that toggles the list's collapsed status.|
|`collapse-icon`|An icon on the collapse button to indicate "collapse". Default is `▲`.|
|`tasks`|The `<ul>` element containing all of the list's items.|
|`add-button`|A button that dispatches the `add` event.|
|`add-icon`|An icon on the add button to indicate "add". Default is `+`.|
|`add-label`|The text on the add button to indicate "add". Default is `Add Task`.|

### `findPart()` and `getPart()`
In addition to being able to select an element from the `<task-list>` element's shadowRoot reference, this element provides a function for selecting one of its parts by using the `findPart()` function.

In this example, the same part is selected with the default shadowRoot reference, and by using the `findPart()` function:
```js
const  = document.querySelector('header');
findPart('').addEventListener('input', (event) =>
{
    // queries the shadowRoot for an element with a part attribute of ""
});
shadowRoot.querySelector('[part="header"]').addEventListener('input', (event) =>
{
    // queries the shadowRoot for an element with a part attribute of ""
});
```
*(note: these two calls do exactly the same thing)*

If one of this element's parts are going to be referenced frequently, the `<task-list>` element's `getPart()` function can be used instead.

With `getPart()`, the element will be cached in RAM for immediate access witout having to perform a DOM query on the shadowRoot.
```js
const  = document.querySelector('');
taskCard.getPart(header'').addEventListener('input', (event) =>
{
    // gets cached element and, if null: queries the shadowRoot for an element with a part attribute of ""
});
taskCard.shadowRoot.querySelector('[part="header"]').addEventListener('input', (event) =>
{
    // queries the shadowRoot for an element with a part attribute of ""
});
```
*(note: these two calls do two different things)*

For event-based or initialization code, `findPart()` should be fine for performance. But if the `<task-list>` element is going to be updated multiple times in a row, the `getPart()` function will provide a smoother experience.

## Events
### `change`
#### Detail
```js
{ 
  target: HTMLElement,
  order?: number,
  previousOrder?: number,
}
```
#### Description
Fires when either the list's name or color changes, and whenever a list item is dropped in the same list it was dragged from.
- `order`:  
provides an integer of the item's index in the `<task-list>` element.
- `previousOrder`:  
provides an integer of the item's index in the `<task-list>` element before it was moved to its current position.
- `target`:  
provides the `<task-list>` element or list item that invoked the change.

### `add`
#### Detail
```js
{ 
  order: number
}
```
#### Description
Fires when the "Add" button is clicked.
- `order`:  
provides an integer for assigning to a new task.

### `added`
#### Detail
```js
{ 
  target: HTMLElement,
  order: number,
}
```
#### Description
Fires when a new item is added to a list.
- `order`:  
provides an integer of the item's index in the `<task-list>` element the item was added to.
- `target`:  
provides the `<task-list>` element that the item was added to.

### `removed`
#### Detail
```js
{ 
  target: HTMLElement,
  order: number
}
```
#### Description
Fires when an item is removed from a list.
- `order`:  
provides an integer of the item's index in the `<task-list>` element the item was removed from.
- `target`:  
provides the `<task-list>` element that the item was removed from.

### `nested`
#### Detail
```js
{ 
  target: TaskListElement,
}
```
#### Description
Fires when a new `<task-list>` element is added to a parent `<task-list>` element.
- `target`:  
provides the `<task-list>` element that was nested within the parent.

### `collapse`
#### Detail
```js
undefined
```
#### Description
Fires when the `<task-list>` element is collapsed and uncollapsed.

## Slots
The `<task-list>` element allows customization by using slots to inject custom html content into its shadowRoot.

The `<task-list>` element exposes the following `slot`s: 
|Slot Name|Description|Default
|-|-|-|
|`header`|A heading that describes and distinguishes the list's items from other elements on the page.|[HTMLHeaderElement]|
|[Default]|Slot that holds all of the list items.(*note: this slot has no name; all children of the `<task-list>` element that do not specificy a `slot` attribute value will be placed in this default slot.*)|[empty]|
|`add-button`|A button that is used to invoke the `add` event, and indicate that the list needs to have a new item injected.|[HTMLButtonElement]|
|`footer`|An area to include additional content or data about the list. Can also be used for nested `<task-list>` elements.|[empty]|

## Styling
The `<task-list>` element itself, and its items, can all be styled with CSS, normally. Each of the elements in the `<task-list>` element's shadowRoot can be selected for styling, directly, by using the `::part()` selector.

In this example, the `header` part is being selected for styling:
```css
task-list::part(header)
{
    /* styling */
}
```

For a list of all part names, see the [parts](#parts) section.

## `<task-card>` and `<task-board>` elements
The `<task-list>` element is designed as a parent to the [`<task-card>`](https://github.com/catapart/magnitce-task-card) element and a child for the [`<task-board>`](https://github.com/catapart/magnitce-task-board) element.

Neither the `<task-board>` or the `<task-card>` elements are required for the `<task-list>` element to function, but design decisions were made around how these three elements are expected to work together.

For developing custom implementations, the [`<task-board>` demo page](https://catapart.github.io/magnitce-task-board/demo/) gives examples of the three elements used as expected.


## License
This library is in the public domain. You do not need permission, nor do you need to provide attribution, in order to use, modify, reproduce, publish, or sell it or any works using it or derived from it.