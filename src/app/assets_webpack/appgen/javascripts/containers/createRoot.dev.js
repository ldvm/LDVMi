import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import DevTools from './DevTools'
import materialTheme from '../misc/materialTheme'

export default createRoutes => {
  return class Root extends Component {
    static propTypes = {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    };

    // Apply custom Material UI theme.

    static childContextTypes = {
      muiTheme: React.PropTypes.object
    };

    getChildContext() {
      return {
        muiTheme: ThemeManager.getMuiTheme(materialTheme)
      };
    }

    render() {
      const { store, history } = this.props;
      return (
        <Provider store={store}>
          <div>
            <div style={{width: '70%'}}>
              <Router history={history}>
                {createRoutes(store.dispatch)}
              </Router>
            </div>
            <DevTools />
          </div>
        </Provider>
      )
    }
  }
}
