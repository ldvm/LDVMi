import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'

export default class Root extends Component {
  render() {
    const { store } = this.props
    return (
      <Provider store={store}>
      </Provider>
    )
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired
}
