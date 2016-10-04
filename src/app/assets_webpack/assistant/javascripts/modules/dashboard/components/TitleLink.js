import React from 'react'
import { Link } from 'react-router'

const h3Style = {
  margin: 0,
  fontSize: '1.32em',
  fontWeight: 'normal'
};

const linkStyle = {
  textDecoration: 'none'
};

const TitleLink = props => (
  <h3 style={h3Style}>
    <Link style={linkStyle} {...props} />
  </h3>);

export default TitleLink;
