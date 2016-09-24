import React, { PropTypes } from 'react'
import Divider from 'material-ui/Divider';
import Checkbox from 'material-ui/Checkbox';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Padding from '../../../../components/Padding'
import EditableLabel from '../../../app/containers/EditableLabel'
import makePureRender from '../../../../misc/makePureRender'
import { Node } from '../models'

const iconMenuStyle = {
  float: 'right',
  marginTop: '-12px',
  marginRight: '-12px',
  position: 'relative',
  zIndex: 1
};

const labelStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.8)',
  float: 'left',
  width: '80%'
};

const NodeCheckbox = ({ node, graphDirected, selected, select, remove, removeWithRelated, disableSelecting, disableManaging }) => {
  return <div>
    <Padding space={2}>
      {disableManaging || <IconMenu
        style={iconMenuStyle}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
      >
        <MenuItem
          primaryText="Remove"
          onTouchTap={remove}
        />
        {graphDirected ?
          ['outgoing', 'incoming'].map(direction =>
            <MenuItem
              key={direction}
              primaryText={'Remove with ' + direction}
              onTouchTap={() => removeWithRelated(direction)}
            />)
          :
          <MenuItem
            primaryText = "Remove with related"
            onTouchTap={() => removeWithRelated()}
          />
        }
      </IconMenu>}
      <div style={labelStyle}>
        <Checkbox
          onCheck={(_, isActive) => select(isActive)}
          disabled={disableSelecting}
          checked={selected}
          label={<EditableLabel uri={node.uri} label={node.label} />}
        />
      </div>
      <div style={{ clear: 'both '}}></div>
    </Padding>
    <Divider />
  </div>
};

NodeCheckbox.propTypes = {
  node: PropTypes.instanceOf(Node).isRequired,
  graphDirected: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  removeWithRelated: PropTypes.func.isRequired,
  disableManaging: PropTypes.bool,
  disableSelecting: PropTypes.bool
};

export default makePureRender(NodeCheckbox);
