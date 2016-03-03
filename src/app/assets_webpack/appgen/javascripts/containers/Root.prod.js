import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import routes from '../routes'
import materialTheme from '../misc/materialTheme'

export default class Root extends Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  // Apply custom Material UI theme.

  static childContextTypes = {
    muiTheme: React.PropTypes.object,
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
          <Router history={history}>
            {routes(store.dispatch)}
          </Router>
        </div>
      </Provider>
    )
  }
}
