import React from 'react'
import { render } from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin' // dependency for material-ui
import browserHistory from './../misc/browserHistory'
import styles from '../../stylesheets/main.scss'
import createRoot from '../containers/createRoot'
import configureStore from '../store/configureStore'

export default function initEntry(createRoutes)  {
  const store = configureStore();
  const Root = createRoot(createRoutes);
  injectTapEventPlugin(); // to make taps in material ui work
  render(<Root store={store} history={browserHistory} />, document.getElementById('approot'));
}