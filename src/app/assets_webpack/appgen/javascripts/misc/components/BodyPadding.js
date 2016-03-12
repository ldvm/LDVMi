import React, { PropTypes } from 'react'
import Padding from './Padding'

const BodyPadding = ({ children }) => {
  return <Padding space={3}>{children}</Padding>;
};

export default BodyPadding;
