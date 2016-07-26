Frontend framework conventions
==============================
*Extracted Section 5.4 from the [thesis text](https://github.com/tobice/thesis-text/releases/latest).*

*We recommend getting familiar with [Frontend Architecture](./FrontendArchitecture.md)
and [Frontend Development Stack Guide](./FrontendDevstackGuide.md) before 
reading this text.*

The tools that we have chosen for our frontend define the overall frontend architecture and the internal mechanisms. Clearly, there is no monolithic framework. Each tool solves only one problem and even though they have been all designed to work well together and complement each other, there is missing an overall architecture and design patterns for large scale applications (something that a monolithic framework, such as Play Framework that we use in backend, usually offers).

There exist recommendations and patterns but they evolve just as quickly and erratically as the modern world of JavaScript frontend itself. While developing the *application generator* (and turning into a *framework*) we had to choose the right patterns and conventions for us and sometimes even come up with some new patterns.

This involves literary everything from the very basic questions of how our code should be organized to which library should we use to generate forms or how we should implement visual feedback for asynchronous requests. In this section we will focus mainly on the basic aspects which involve the code organization which is important because it affects the process of integrating new *visualizers*.

Note that these conventions and patterns present a significant contribution from our side. Whereas the core architecture concepts were to a large extent just given to us through the chosen development stack, it is these conventions and patterns that adopt the concepts, taking them from simple demos to a rather large, complex and extendable application that our *application generator* is.

## JavaScript bundles

As explained, our frontend code is written in ES6 and has to be compiled (or more correctly *transpiled*) into standard JavaScript that any browser can understand. The frontend codebase consists of large amount of (not only) ES6 files which are all transpiled and put together into a single JavaScript file which we call a *bundle*. This bundle is loaded to the web browser and contains everything that is required to run the SPA. We use Webpack bundler [3] to put our code together and Babel [4] transpiler to convert our code.

The disadvantage of this approach is that this bundle is typically relatively large (3-4 Megabytes at this moment) and therefore takes some time to load. Before it loads, the user does not see anything on the screen. On the other hand, once it is loaded, the user experience is very smooth because we do not have to make any more request to the server to fetch additional resources.

Our *application generator* consists of several bundles which correspond to the different SPAs. The main is the *platform* bundle which contains the whole *platform* user interface and also *configurator* interfaces for all registered *visualizers*. Then every registered *visualizer* has its own bundle that contains only the *application* interface. This bundle is used for published applications and as it does not contain the whole platform, it is significantly smaller and faster to load.

Even though we have multiple bundles, all the code exists in one spot. The reason is that there is very little code that is used only in a single bundle and therefore it would not make sense to separate it in any way. What defines a bundle is an *entry point* which is a simple JavaScript file where Webpack starts the bundling process.

## Code structure

The frontend code is all in the folder `src/app/assets_webpack/appgen`. We will refer to this folder as to the `assets` folder. There are two subfolders `javascripts` and `stylesheets` with self-explanatory names. What is interesting is that the styles are also included into the bundle. Let us now quickly walk through the folders in `javascripts`.

-   **components** – useful single-purpose React components

-   **containers** – the top level React components that are connected to Redux

-   **entries** – Webpack entry points (each file here corresponds to a bundle)

-   **misc** – various utilities

-   **modules** – the actual code

-   **store** – instantiation of Redux *store*

## Ducks

Our code contains lots of Redux *actions*, *reducers* and Reselect *selectors*. A common pattern is to put all *actions* into the `actions.js` file, all *reducers* into the `reducers.js` file and all selectors into a `selectors.js` file. In our *application generator*, we decided to adopt the *duck* format [5]. The idea is that we put all *actions*, *reducers* and *selectors* related to the same functionality into a single file called a *duck*.

We take the example where we were explaining how Redux works and rewrite it into the duck format. This would be a single file (i.e., an ES6 module).

```js
// Actions 

export const INCREMENT = ’INCREMENT’;
export function increment() {
  return { type: INCREMENT };
}

export const DECREMENT = ’DECREMENT’;
export function decrement() {
  return { type: DECREMENT };
}

// Reducer

export default function valueReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
    }
}

// Selectors

export const valueSelector = state => state.value;
```

This *duck* covers the complete functionality regarding incrementing and decrementing a value. It exports public API for updating the value (*action creators*), reading the value (*selectors*) and it defines how the value should be represented and updated (*reducer*). The *action types* are exported as well which means that anyone can listen to these *dispatched* *actions*. In *object-oriented programming* terminology we could say that the *action creators* correspond to object *setters* and *selectors* to object *getters*.

## Modules

Clearly, having all React components and all *ducks* in a single place is not viable for large applications. Therefore we introduce a *module* which is the base organization unit in our code (please do not confuse it with ES6 modules). A *module* is similar to a *package* from Java. It usually covers one area of functionality. For example, we have an `auth` *module* that covers everything related to authenticating and registering users. Also every registered *visualizer* has its own *module*.

A *module* is in the first place a folder with standardized content. Let us walk through folders that a *module* typically contains.

-   **components** – React components that focus mainly on the visuals (*view* components)

-   **containers** – React components that are connected to Redux and handle business logic (*controller* components)

-   **dialogs** – React components for dialog windows

-   **ducks** – *ducks* required in this module

-   **misc** – various utilities

-   **pages** – React components that are bound to React-router routes

As a module covers a concrete functionality, it is very likely to define its own *actions*. All *action types* in one *module* should have a common prefix corresponding to the *module* name. Firstly, when an *action* is dispatched, we can easily identify which *module* it came from. Secondly, we do not have to worry about conflicting *action types* (with the prefix we are creating a separated namespace). Therefore each *module* needs to contain a `prefix.js` file.

```js
// prefix.js

import createPrefixer from '../../../misc/createPrefixer'

export const MODULE_PREFIX = 'example';
export default createPrefixer(MODULE_PREFIX);
```

The `MODULE_PREFIX` should contain the *module* name, i.e., the folder name containing the *module*. We tried to come up with a solution which would automatically populate this constant with the folder name but that is, to our best knowledge, not possible due to how Webpack bundling process works.

This is how we would use it in our *duck* (following the *module* structure, the *duck* should be placed in `ducks/value.js`).

```js
// ducks/value.js

import prefix from '../prefix.js'

// Actions 

export const INCREMENT = prefix(’INCREMENT’);
export function increment() {
  return { type: INCREMENT };
}

export const DECREMENT = prefix(’DECREMENT’);
export function decrement() {
  return { type: DECREMENT };
}
```

The *action types* are now `example/INCREMENT` or `example/DECREMENT`.

The *modules* are meant to be nested, on the file system level (nesting folders) but also on the *state* level. Each *module* has to define a root *reducer* combining all its nested *reducers*.

```js
// reducer.js

import { combineReducers } from 'redux'
import value from './ducks/value' // the default export points to the reducer

const rootReducer = combineReducers({
  value
});

export default rootReducer;
```

This root *reducer* has to be added to the root *reducer* of the parent *module* in a similar manner.

Complementary to *reducers* are *selectors*. Each *module* defines its root *selector*.

```js
// selector.js

import { createSelector } from 'reselect'
import parentSelector from '../selector'
import { MODULE_PREFIX } from './prefix'

export const moduleSelector = createSelector(
  [parentSelector],
  parentState => parentState[MODULE_PREFIX]
);
export default moduleSelector;
```

Note that the logic is inverted to how the *reducers* are composed. Here we use the parent *selector* to access the *state* of the parent *module* and we select the piece that belongs to our *module*. This is given by the APIs of Redux and Reselect. We just have to make sure to use the same key when registering both the *reducer* and the *selector* (the *module* name should be used as the key).

Using this approach, the *state* hierarchy corresponds to the *module* folder hierarchy. What is important is that this defines a clear way of how the application can be arbitrarily and endlessly extended with very little risk of conflicts. *Modules* can be arbitrarily renamed and moved around. We just have to make sure to always connect the *reducer* and the *selector* to the right spot.

A *module* can also contain routes that would be composable in a similar manner. The route structure, however, does not strictly follow the folder structure as the situation with routing is more complicated. For example, a *module* representing a *visualizer* defines two sets of routes: one for the *configurator* interface and one for the *application* interface.
