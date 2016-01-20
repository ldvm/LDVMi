import React from 'react'
import { render } from 'react-dom'
import { syncReduxAndRouter } from 'redux-simple-router'
import injectTapEventPlugin from 'react-tap-event-plugin' // dependency for material-ui
import browserHistory from './misc/browserHistory'
import styles from '../stylesheets/main.scss'
import Root from './containers/Root'
import configureStore from './store/configureStore'

const store = configureStore();

injectTapEventPlugin(); // to make taps in material ui work

render(<Root store={store} history={browserHistory} />, document.getElementById('approot'));

