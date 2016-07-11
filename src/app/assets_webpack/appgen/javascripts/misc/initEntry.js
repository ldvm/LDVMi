import React from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin' // dependency for material-ui
import browserHistory from './../misc/browserHistory'
import styles from '../../stylesheets/main.scss'
import createRoot from '../containers/createRoot'
import configureStore from '../store/configureStore'

// React 15.2 is throwing a 'Unknown props' warning all around the place. Some of our dependencies
// are not ready yet. So let's just change the level from error to info to get rid of the ugly
// warnings until it gets fixed.
// TODO: remove this ugly workaround.
const consoleError = console.error;
console.error = function () {
  if (arguments[0].match('Unknown prop')) {
    console.info.apply(this, arguments);
  } else {
    consoleError.apply(this, arguments);
  }
};

export default function initEntry(createRoutes)  {
  const store = configureStore();
  const Root = createRoot(createRoutes);
  injectTapEventPlugin(); // to make taps in material ui work
  render(<Root store={store} history={browserHistory} />, document.getElementById('approot'));
}