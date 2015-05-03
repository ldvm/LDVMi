import styles from '../stylesheets/main.less'

import React from 'react'
import Router from 'react-router'
import routes from './routes.jsx'

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