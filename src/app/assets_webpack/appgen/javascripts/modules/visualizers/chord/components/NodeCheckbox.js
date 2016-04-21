import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import Padding from '../../../../components/Padding'
import Label from '../../../core/containers/Label'
import makePureRender from '../../../../misc/makePureRender'
import { Node } from '../models'

const labelStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.8)'
};

const dividerStyle = {
  clear: 'both'
};

const Option = ({ node, selected, onSelect }) => {
  return <div>
    <Padding space={2}>
      <div style={labelStyle}>
        <Checkbox
          onCheck={(_, isActive) => onSelect(isActive)}
          checked={selected}
          label={<Label uri={node.uri} label={node.label} />}
        />
      </div>
    </Padding>
    <Divider style={dividerStyle} />
  </div>
};

Option.propTypes = {
  node: PropTypes.instanceOf(Node).isRequired,
  selected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default makePureRender(Option);
