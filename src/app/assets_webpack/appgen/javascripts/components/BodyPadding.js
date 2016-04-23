import React, { Component, PropTypes } from 'react'
import Padding from './Padding'
import MaterialTheme from '../misc/materialTheme'

const SPACE = 3;

const BodyPadding = ({ children }) => {
  return <Padding space={SPACE}>{children}</Padding>;
};

export default BodyPadding;

export function addBodyPadding(ComposedComponent) {
  return class WithBodyPadding extends Component {
    render() {
      return <BodyPadding><ComposedComponent {...this.props} /></BodyPadding>
    }
  }
}

export const bodyPaddingSpace = MaterialTheme.spacing.desktopGutterMini * SPACE;
