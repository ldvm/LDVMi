import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import MuiTheme from '../components/MuiTheme'

export default createRoutes => {
  return class Root extends Component {
    static propTypes = {
      store: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired
    };

    render() {
      const { store, history } = this.props;
      return (
        <Provider store={store}>
          <MuiTheme>
            <Router history={history}>
              {createRoutes(store.dispatch)}
            </Router>
          </MuiTheme>
        </Provider>
      )
    }
  }
}
