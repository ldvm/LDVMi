import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import { Router } from 'react-router'
import DevTools from './DevTools'
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
          <div>
            <div style={{width: '70%'}}>
              <MuiTheme>
                <Router history={history}>
                  {createRoutes(store.dispatch)}
                </Router>
              </MuiTheme>
            </div>
            <DevTools />
          </div>
        </Provider>
      )
    }
  }
}
