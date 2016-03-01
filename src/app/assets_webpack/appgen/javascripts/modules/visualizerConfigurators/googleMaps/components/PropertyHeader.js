import React, { PropTypes } from 'react'
import { Property } from '../models'

// TODO: add padding. Perhaps <Padded /> component?
// TODO: show the whole value using tooltip

const headerStyle = {
  backgroundColor: '#f7f7f7'
};

const labelStyle = {
  fontWeight: 'normal',
  fontSize: '1.05rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const smallStyle = {
  fontSize: '0.9rem',
  color: '#aeaeae'
};

const PropertyHeader = ({ property }) => {
  return <div style={headerStyle}>
    <h3 style={labelStyle}>
      {property.label} <br />
      <small style={smallStyle}>{property.uri}</small>
    </h3>
  </div>
};

PropertyHeader.propTypes = {
  properties: PropTypes.instanceOf(Property)
};

export default PropertyHeader;
