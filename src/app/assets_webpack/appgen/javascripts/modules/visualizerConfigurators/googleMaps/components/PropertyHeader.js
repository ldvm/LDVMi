import React, { PropTypes } from 'react'
import Tooltip from 'material-ui/lib/tooltip';
import { Property } from '../models'
import Padding from '../../../../misc/components/Padding'
import * as theme from '../../../../misc/theme'

// TODO: show the whole value using tooltip

const headerStyle = {
  backgroundColor: '#f7f7f7'
};

const h3Style = {
  fontWeight: 'normal',
  fontSize: '1.05rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  margin: '0',
  padding: '0'
};

const smallStyle = {
  fontSize: '0.9rem',
  color: '#aeaeae'
};

const PropertyHeader = ({ property }) => {
  return <div style={headerStyle}>
    <Padding space={2}>
      <h3 style={h3Style}>
        {property.label} <br />
        <small style={smallStyle}>{property.uri}</small>
      </h3>
    </Padding>
  </div>
};

PropertyHeader.propTypes = {
  properties: PropTypes.instanceOf(Property)
};

export default PropertyHeader;
