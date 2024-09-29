# magnitce-task-list
A custom html element that provides sorting and management for custom task-card elements.

A custom `HTMLElement` that represents a task and provides an api for task properties.

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
The `<task-list>` element is a container element for [`<task-card>`](https://github.com/catapart/magnitce-task-card) elements. It provides mangement functionality with helper functions for adding and removing tasks, as well as dragging and dropping.

## Attributes
|Attribute|Effect|
|-|-|
|``||

## Parts
The `<task-list>` element uses the `part` attribute to expose its shadow DOM content to the light DOM both for styling and selecting in javascript.

|Part Name|Description|
|-|-|
|``||

### `findPart()` and `getPart()`
In addition to being able to select an element from the `<task-list>` element's shadowRoot reference, this element provides a function for selecting one of its parts by using the `findPart()` function.

In this example, the same part is selected with the default shadowRoot reference, and by using the `findPart()` function:
```js
const  = document.querySelector('');
findPart('').addEventListener('input', (event) =>
{
    // queries the shadowRoot for an element with a part attribute of ""
});
shadowRoot.querySelector('[part=""]').addEventListener('input', (event) =>
{
    // queries the shadowRoot for an element with a part attribute of ""
});
```
*(note: these two calls do exactly the same thing)*

If one of this element's parts are going to be referenced frequently, the `<task-list>` element's `getPart()` function can be used instead.

With `getPart()`, the element will be cached in RAM for immediate access witout having to perform a DOM query on the shadowRoot.
```js
const  = document.querySelector('');
taskCard.getPart('').addEventListener('input', (event) =>
{
    // gets cached element and, if null: queries the shadowRoot for an element with a part attribute of ""
});
taskCard.shadowRoot.querySelector('[part=""]').addEventListener('input', (event) =>
{
    // queries the shadowRoot for an element with a part attribute of ""
});
```
*(note: these two calls do two different things)*

For event-based or initialization code, `findPart()` should be fine for performance. But if the `<task-list>` element is going to be updated multiple times in a row, the `getPart()` function will provide a smoother experience.

## Events
|Event|Detail|
|-|-|
|``|`{  }`|

## Slots
The `<task-list>` element allows customization by using slots to inject custom html content into its shadowRoot.

The `<task-list>` element exposes the following `slot`s: 
|Slot Name|Description|Default
|-|-|-|
|``|||

## Styling

## `<task-card>` and `<task-board>` elements
The `<task-list>` element is designed as a parent to the [`<task-card>`](https://github.com/catapart/magnitce-task-card) element and a dependency for the [`<task-board>`]() element


## License
This library is in the public domain. You do not need permission, nor do you need to provide attribution, in order to use, modify, reproduce, publish, or sell it or any works using it or derived from it.