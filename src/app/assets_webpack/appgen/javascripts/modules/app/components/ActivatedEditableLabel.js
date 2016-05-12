import React, { PropTypes, Component } from 'react'
import IconButton from '../../../components/IconButton'
import * as theme from '../../../misc/theme'

const boxShadow = '0 3px 10px rgba(0,0,0,0.16), 0 3px 10px rgba(0, 0, 0, 0.23)';
const borderRadius = '2px';

const containerStyle = {
  color: theme.primary,
  backgroundColor: 'white',
  boxShadow: boxShadow,
  position: 'relative',
  borderRadius: borderRadius
};

const iconContainerStyle = {
  position: 'absolute',
  right: '-38px',
  bottom: 0,
  marginBottom: '-15px',
  zIndex: 999
};

const iconStyle = {
  backgroundColor: 'white',
  boxShadow: boxShadow,
  borderRadius: borderRadius,
  width: '18px',
  height: '18px'
};

class ActivatedEditableLabel extends Component {
  static propTypes = {
    edit: PropTypes.func.isRequired
  };

  render() {
    const { children, edit } = this.props;

    return (
      <span style={containerStyle}>
        {children}
        <div style={iconContainerStyle}>
          <IconButton
            icon="mode_edit"
            iconStyle={iconStyle}
            tooltip="Edit custom label"
            onClick={edit} />
        </div>
      </span>
    )
  }
}

export default ActivatedEditableLabel;
