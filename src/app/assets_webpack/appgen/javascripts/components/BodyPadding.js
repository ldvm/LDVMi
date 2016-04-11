import React, { Component, PropTypes } from 'react'
import Padding from './Padding'

const BodyPadding = ({ children }) => {
  return <Padding space={3}>{children}</Padding>;
};

export default BodyPadding;

export function addBodyPadding(ComposedComponent) {
  return class WithBodyPadding extends Component {
    render() {
      return <BodyPadding><ComposedComponent {...this.props} /></BodyPadding>
    }
  }
}
