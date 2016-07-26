Frontend development stack
==========================
*Extracted Attachment A from the [thesis text](https://github.com/tobice/thesis-text/releases/latest).*

*The [Frontend Architecture](./FrontendArchitecture.md) contains 
essentially the same info but on the conceptional level. Both texts
complement each other.*

The following sections present a short extract from documentations of individual tools that were used for the *application generator* frontend. Their purpose is not to substitute the documentation but merely to provide the reader with enough information so that he can understand our code.

ES6 and Babel compiler
----------------------

The frontend is completely written using ECMAScript 2015 (known as ES6) which is the 6th version of ECMAScript standard. JavaScript is an implementation of ECMAScript, available in all mainstream browsers. ES6 introduces many new language constructs which are, however, not all supported by the current JavaScript implementation. We use Babel [1] transpiler which converts our ES6 code into standard JavaScript.

We will mention some of the features that we frequently use.

```js
// Arrow functions
[1, 2, 3].map(x => x * x);

// var is replaced with const (for constants) and let (for mutable variables)
const PI = 3.14;
let i = 1;
i++;

// Standard class syntax (the prototypical inheritance is still under the hood)
class Dog extends Animal {
  constructor(name) {
    super(name);
  }
}

// Enhanced Object Literals
const a = 2;
const b = 3;
const obj = { a, b };
obj.a === 2;
obj.b === 3;

// Desctructing
const obj = { a: 2, b: 3 };
const { a, b } = obj;
a === 2; // true
b === 3; // true

const arr = [1, 2, 3];
const [a, b] = obj;
a === 1; // true
b === 2; // true
```

Perhaps the most important feature for us are ES6 modules. Each file is a module which *imports* its dependencies and *exports* values that make a public API of that module.

```js
// lib/math.js

export const PI = 3.14;

export function add(a, b) {
  return a + b;
}

export const multiply = (a, b) => a * b;

export default { add, multiply, PI };
```

There are several ways how a dependency can be *imported*.

```js
import { multiply, PI } from './lib/math'

const result = multiply(PI, 2);

import * as math from './lib/math'

const result = math.add(math.PI, 2);

import math from './lib/math'

const result = math.add(math.PI, 2);
```

npm
---

npm is a package manager for JavaScript. We use it to manage our JavaScript dependencies. They are all listed in the file `src/package.json`. Once installed, a package can be used with the standard `import` command.

```js
import moment from 'moment'

 // prints current time and date, i.e. June 24th 2016, 8:52:00 pm
moment().format('MMMM Do YYYY, h:mm:ss a');
```

Note that when importing a npm dependency, we do not use relative paths starting with a dot.

React
-----

React is a JavaScript library for building user interfaces. The base building block is a React component.

```js
import React from 'react'

const HelloMessage = ({ name }) => (
    <div>Hello <strong>{name}</strong></div>
  )

React.render(<HelloMessage name="Jon Snow" />, document.getElementById('container'));
```

This is the simplest shortest example possible where a component works as a plain function. It takes some input data and prints user interface. The input data are in the form of `props` which are passed in the first argument (we use ES6 destructing to extract the name `prop`). The user interface is defined using a XML-like syntax called JSX. This component prints a greeting with the highlighted name. Using the last line, the component is mounted to a specific DOM node marked with an id equal to “container”.

The components can be composed.

```js
const HelloMessage = ({ name }) => (
    <div>Hello <strong>{name}</strong></div>
  );
      
const MessageList = ({ names }) => (
    <ul>
      {names.map(name => 
        <li>
          <HelloMessage name={name} />
        </li>
      )}
    </ul>
  )

const names = ['Jon Snow', 'Tyrion'];
React.render(<MessageList names={names} />, document.getElementById('container'));
```

This example will print a greeting for each name in the list. As you can see, we can easily combine HTML tags with our own components. The `props` are passed down to the components with the syntax that we use for specifying standard HTML attributes.

The components can be interactive.

```js
class Counter extends React.Component {
  constructor(props) {
    this.state = {
      value: props.initialValue
    }
  }
      
  increase() {
    this.setState({
      value: this.state.value + 1
    })
  }
      
  render() {
    const { value } = this.state;
    return (
      <input type="button" 
        onClick={() => this.increase()} 
        value={'Increase: ' + value} />
     );
  }
} 

React.render(<Counter initialValue={10} />, document.getElementById('container'));
```

This component no longer works as a simple function as it maintains its own state. The state contains just a numeric value which is increased every time the user clicks the button. The value is displayed in the input label. Note that we cannot simply assign the new value to the `state` object, we need to use the `setState` method which is part of the React API.

In this case, the rendered UI is a function of the component `props` and the component `state`. Whereas the `props` are immutable (like function arguments), the `state` can be mutated within the component.

In React, **you do not mutate the user interface**. That means that you do not define how the user interface should transition between different states but instead, you specify how the interface should look like given the current `props` and `state`. Every time the `state` changes or new `props` are passed from the parent component, the whole UI is completely re-rendered. This significantly simplifies building interactive user interfaces. If nothing else, the number of possible component states is significantly lower than the number of possible transitions between those states.

The React API defines several life cycle methods.

```js
class GreetOnMount extends React.Component {
  componentWillMount() {
   alert('This component is about to be mounted to the DOM tree!');
  }
      
  componentWillUnmount() {
   alert('This component is about to be unmounted from the DOM tree!');
  }
      
  render() {
   return <div />
  }
}
```

We have used two life cycle methods, `componentWillMount` which is triggered when the component is about to appear, and `componentWillUnmount` which is triggered when the component is about to disappear from the screen. These methods are especially useful for components that fetch data from the server. The first method can be used to initiate the request and the second method to cancel the request or possibly do some cleanup.

Redux
-----

Using the MVC terminology, a React component would be called a *controller-view*[2]. It both handles the interaction with the user and the visual representation. In our code, we usually try to distinguish between controllers and views. We create either a component that is rather a controller, i.e., it handles user input but does not focus on the visuals, or a component that is rather a view, i.e., there is no business logic going on and the component focuses only on representing the data on the screen. By composing components of these two types we build the whole user interface.

The component state would correspond to the definition of the *Model* layer. Nevertheless, this approach, i.e., storing everything in the state of React components, would not work for large-scale applications which would have a lot of state. The *state* in this context can mean literary everything, starting all the data fetched from the server, ending with the list of open dialog windows. That is why we use Redux.

Redux is, as explained by the authors, a “predictable state container for JavaScript apps”  that evolved from the Flux ideas. Flux is an application architecture that was designed specifically to work with React applications. Even though Redux is independent on React, they work extremely well together.

Setting up Redux with React is a bit complicated so we skip it. It is not really necessary because it is already done for us in the fronted code base and we can immediately start using it. The more important thing is to understand how it works.

The core idea is that we move the state out of the components. Let us start with a simple example. Our *state* will be just a single number. We want to be able to increment and decrement the number. For each such operation we create an *action type*.

```js
const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
```

It is good practice that we also define *action creators*.

```js
function increment() {
  return { type: INCREMENT };
}

function decrement() {
  return { type: DECREMENT };
}
```

Now we define a special function called a *reducer* which specifies how every *action* transforms the *state*.

```js
function valueReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}
```

The function takes the current *state* and an *action* as an argument. Depending on the *action type* (and typically also *action payload*), it transforms the *state*. Important is that the function does not mutate the old *state* but rather creates a completely new *state* from the old *state*. In this case the *state* is just an integer which is by its nature immutable. If the *state* was more complex, typically an object, we would need to make sure to create a new object every time it changes.

From a *reducer* we create a *store* which represents a running instance of Redux. It holds the current *state* and provides a *dispatch* function that we use to apply the *actions* on the *state*. Note in the following code snippet, that invoking `increment()` does not increase the value. It simply returns an *action* object which is then *dispatched* and processed by the *reducer*.

```js
dispatch(increment());
dispatch(decrement());
```

Now let us see how we bind this to a React component.

```js
import React from 'react'
import { connect } from 'react-redux'

const Counter = ({ dispatch, value }) => (
  <div>
    {value}
    <input type="button" onClick={() => dispatch(increase())} label="Increase" />
    <input type="button" onClick={() => dispatch(decrease())} label="Decrease" />
  </div>
);

const mapStateToProps = state => ({
  value: state
});

export default connect(mapStateToProps)(Counter);
```

This way we *connected* the component to the *store*. The *dispatch* function is automatically injected to the component as a *prop* which means that we can start *dispatching* actions to modify the *state*. The *state* (in our case just a single integer) is also injected to the component through the *props* but we have to specifically define how that should happen using the `mapStateToProps` function.

The process makes up a circle. The user clicks the button in the component and an *action* is *dispatched* to the *reducer*. The *reducer* updates the *state* and the *store* notifies the component of a change. The component re-renders with the updated value. As the *state* can be changed only using *actions*, the system behavior is predictable and very explicit. Redux offers a development mode in which it is very easy to monitor the *actions* flowing through the system and how they change the *state*.

The *reducers* can be composed and combined. Let us now add another reducer that will simply count the number of clicks.

```js
function clickCountReducer(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
    case DECREMENT:
      return state + 1
    default:
      return state
  }
}
```

Now we combine the reducers together.

```js
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  value: valueReducer,
  clickCount: clickCountReducer
});
```

This creates a new *reducer* that combines the other two *reducers* together in a way that it maintains two values in an object where each value is updated by the corresponding *reducer*. Whenever an *action* is *dispatched*, the root *reducer* passes the *action* to both child *reducers*.

Suddenly, our *state* is more complicated because it is an object with two values. We have to update the `mapStateToProps` function accordingly.

```js
const Counter = ({ dispatch, value, clickCount }) => (
  // ...
);

const mapStateToProps = state => state;
```

In this case, we could actually significantly simplify the function as the *state* structure directly corresponds to the *props* that we want to inject.

In a similar manner we could start adding more and more *reducers* to fit the needs of the application (and the *state* hierarchy would grow correspondingly). Our *application generator* has only one single vast and deep *state* that holds all the information. If we apply the React component hierarchy on this *state* hierarchy (updated by the *reducer* hierarchy), we get the user interface that is currently on the screen. We can say that what you can see on the screen is a *function* of the *state*.

Reselect
--------

We use the `mapStateToProps` function to extract the values from the *state* required by a component. That worked really well for our simple examples but it would not scale with the increasing size and depth of the *state* object.

The *state* can be viewed as a database. It is a huge blob of data that any part of the application can access. It defines a clear API for making updates and the updates are always performed in transactions (that stems from the single-threaded nature of JavaScript but what also matters is that when an *action* is *dispatched*, it has to update all *reducers* first before another *action* can be *dispatched*). What we miss is an API for selecting data from the database, i.e., the *state*. We use Reselect for that.

We will re-use the last iteration of our example with the `valueReducer` and `clickCountReducer`.

```js
import {  createStructuredSelector } from 'reselect'

// ... the component

const valueSelector = state => state.value;
const clickCountSelector = state => clickCount;

const selector = createStructuredSelector({
  value: valueSelector,
  clickCount: clickCountSelector
});

export default connect(selector)(Counter);
```

A Reselect *selector* is like a named database query. It extracts a specific piece of data from the *state*. We defined two base *selectors* that access directly the state and we combined them together. Our final *selector* becomes the `mapStateToProps` function. What is important is that once a *selector* is created, we do not have to care about how it is implemented. For us, it is just a query that returns the data we need. That separates us from the raw *state* structure. Just like we have a *reducer* hierarchy and a *component* hierarchy, we can add a *selector* hierarchy covering the whole *state*.

Let us say that `state.auth.user.id` contains the ID of the currently authenticated user. We want to inject that ID into a component. This is the simple `mapStateToProps` approach:

```js
const mapStateToProps = state => ({
  userId: state.auth.user.id
});
```

With a smart *selector* hierarchy, we could do this.

```js
import { createSelector } from 'reselect'
import { userSelector } from './selectors'

const selector = createSelector(
  [userSelector],
  user => ({ userId: user.id }));
```

Whereas in the first example, we actually have to know the complete *state* hierarchy to extract this piece of information (and that can very often change due to refactoring), in the second example we are completely separated from the *state* hierarchy and we just need to know the schema of the user object that the `userSelector` returns.

The selectors can do some extra calculations. Using a simple math formula we calculate the number of increment clicks. Clearly, we could maintain this information in another *reducer* but as we can derive this information from information that is already in the state, it would be duplication.

```js
const incrementCountSelector = createSelector(
  [valueSelector, clickCountSelector],
  (value, clickCount) => (clickCount + value) / 2);
```

The *selectors* can be arbitrarily combined.

```js
const decrementCountSelector = createSelector(
  [clickCountSelector, incrementCountSelector],
  (clickCount, incrementCount) => clickCount - incrementCount);
```

Every time the *state* is updated, the *selectors* are recalculated and consequently the *components* are re-rendered. The *selectors* are actually slightly smarter than that. The *selector* output is automatically cached and if its input does not change, the cached value is returned instead. Therefore the *selectors* can be used even for heavy computations.

React-router
------------

As one would expect, our *application generator* will consist of many different screens with different functionality. We need a mechanism for transitioning between those screens. Although many approaches are viable, we prefer the one with classic URLs, i.e., every different screen has its own URL. It has clear benefits as the user navigates through the interface as if it was a standard web page (e.g. even with the back button support).

Our *application generator* is a SPA which means that each URL will contain the part corresponding to the actual physical address of the SPA (the entry URL) and the part maintained only by the frontend JavaScript application.

```js
Sample URL: 
http://localhost:9000/appgen/dashboard/discoveries

SPA entry URL: 
http://localhost:9000/appgen/

Virtual URL part maintained by the SPA: 
dashboard/discoveries
```

JavaScript API in modern web browsers allows us to change the URL without actually reloading the page.

We use React-router as a routing library for React. To show you how it works, we borrow an example from their documentation[3].

```js
import React from 'react'
import { Route, IndexRoute } from 'react-router'

const App = ({ children }) => (
    <div>
      <h1>Welcome to our app</h1>
      {children}
    </div>
  );

const About = () => <h2>About</h2>

const Users = ({ children }) => (
    <div>
      <h2>Users</h2>
      {children}
    </div>
  );

const User = ({ params: { userId }}) => <div>User: <strong>{userId}</div>

const NoMatch = () => <h2>Not found</h2>

const routes = (
    <Route path="/" component={App}>
      <Route path="about" component={About}/>
      <Route path="users" component={Users}>
        <Route path=":userId" component={User}/>
      </Route>
      <Route path="*" component={NoMatch}/>
    </Route>
  );
```

The React-router uses JSX for routes definition which makes it very declarative. For each route, we define a React component that is activated when the URL matches this particular route. The URL segment that has to be matched is defined by the `path` attribute, the component by the `component` attribute. The routes definition is hierarchical specifying the complete URL schema.

When a URL is matched, all components along the path of matching routes through the routes definition are activated. For example, for the URL `/users/15` the components `App`, `Users` and `User` are activated. The child component is always passed to the parent component through the `children prop`.

As you might have noticed, all the tools in our stack introduce some kind of explicit composability. That is very useful because it will make all parts of our *application generator* easily extendable and re-usable.

Immutable.js
------------

Immutable.js is a library containing standard data structures that we may know for example from Java (e.g. `List`, `Map` or `Stack`). The core feature is that all the data structures are *immutable* which means that they cannot be changed. If we change an instance of a `List` (e.g. by adding an element) we create a completely new instance and the old one remains unchanged. Consider the following example.

```js
import { List } from 'immutable'

const list = new List();
const listUpdated = list.push(5);

list.size === 0;
listUpdated.size === 1;
```

This library has many advantages. Firstly, it provides an extremely strong and well documented API which goes beyond the capabilities of standard JavaScript collections (`object` or `array`). The API fits better into the functional nature of our code. Secondly, it works really well with *reducers*. As explained, a *reducer* has to always return a new state which is sometimes a bit complicated using the standard JavaScript API. In the following example, we need to create a new copy of an object containing users identified by their IDs.

```js
function usersReducer(state = {}, action) {
  switch (action.type) {
    case ADD_USER: 
      return Object.assign({}, state, {
        action.payload.id: action.payload.id
      })
    default:
      return state;
  }
}
```

Now consider the version with Immutable.js.

```js
import { Map } from 'immutable'

function usersReducer(state = new Map(), action) {
  switch (action.type) {
    case ADD_USER: 
      return state.set(action.payload.id, action.payload.id);
    default:
      return state;
  }
}
```

Thirdly, there are some speed benefits as this is what makes the Reselect caching actually possible. A *selector* recalculates only when the input arguments change. If an input argument was a standard mutable object, it would be very complicated (and expensive) to determine whether it changed. We would be keeping a reference to that object and have no idea whether the object was changed in the mean time. On the other hand, if we keep a reference to an immutable structure and the reference does not change, then we can be sure that the content of the referenced structure also did not change and we can re-use the cached value. Similar mechanism is used also for React components, i.e., it is possible to avoid unnecessary re-renders.

Lastly, Immutable.js library offers the `Record` data structure which is essentially a `Map` (i.e., a *key-value* storage, just like a standard JavaScript `object`) but with an enforced schema.

```js
const User = Record({
  id: 0,
  name: 'Anonymous user'
});

const user = new User({ id: 5, gender: 'male' });

user.id === 5;
user.name === 'Anonymous user';
user.gender === null;
```

Any values that are missing during the instantiation are replaced with the default values and any values that are not part of the schema are removed. Unlike the standard immutable `Map`, a `Record` properties can be accessed using the standard dot notation (it even supports destructing). It is also very useful when we are defining the `propTypes` of a React component.

```js
class UserView extends React.Component {
  static propTypes = {
    user: React.PropTypes.instanceOf(User).isRequired
  }
}
```

If this component does not receive a `User` instance through the `props`, a warning is thrown.

[1] https://babeljs.io/

[2] <https://facebook.github.io/flux/docs/overview.html>

[3] <https://github.com/reactjs/react-router#whats-it-look-like>
