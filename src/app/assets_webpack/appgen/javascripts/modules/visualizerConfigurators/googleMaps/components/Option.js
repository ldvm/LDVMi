import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import { Option as OptionModel } from '../models'
import Padding from '../../../../misc/components/Padding'
import makePureRender from '../../../../misc/makePureRender'
import { optionModes as modes } from  '../models'

const labelStyle = {
  fontSize: '0.9rem',
  color: 'rgba(0, 0, 0, 0.8)'
};

const countStyle = {
  fontSize: '0.8rem',
  color: 'rgba(0, 0, 0, 0.6)',
  fontWeight: 'bold'
};

const dividerStyle = {
  clear: 'both'
};

const configStyles = {
  [modes.USER_DEFINED]: {
  },
  [modes.SELECT_ALWAYS]: {
    color: 'rgba(0, 0, 0, 0.3)'
  }
};

const Option = ({ option, onSelect }) => {
  const { count, mode, skosConcept } = option;

  return <div>
    <Padding space={2}>
      <div style={Object.assign({}, labelStyle, configStyles[mode])}>
        <Checkbox
          disabled={mode == modes.SELECT_ALWAYS}
          onCheck={(_, isActive) => onSelect(isActive)}
          checked={option.selected}
          label={<span>
            {skosConcept.label}{' '}
            {count !== null && <span style={countStyle}>({count})</span>}
          </span>}
        />
      </div>
    </Padding>
    <Divider style={dividerStyle} />
  </div>
};

Option.propTypes = {
  option: PropTypes.instanceOf(OptionModel).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default makePureRender(Option);
