import styles from '../stylesheets/main.less'

import objectAssign from 'object-assign'
import React from 'react'
import Router from 'react-router'
import routes from './routes.jsx'

// Object.assign *should* be part of the ES6 but it's not currently supported by Babel (at least
// not out of the box). This was the easiest way to get it working.
if (!Object.assign) {
    Object.assign = objectAssign;
}

function run() {
    const approot = document.getElementById('approot');
    Router.run(routes, Router.HistoryLocation, function (Handler) {
        React.render(React.createElement(Handler), approot);
    });
}

// Wait until the page is fully loaded.
if (window.addEventListener) {
    window.addEventListener('DOMContentLoaded', run);
} else {
    window.attachEvent('onload', run);
}