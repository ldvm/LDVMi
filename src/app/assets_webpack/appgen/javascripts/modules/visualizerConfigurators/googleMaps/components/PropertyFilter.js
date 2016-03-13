import React, { PropTypes } from 'react'
import Divider from 'material-ui/lib/divider';
import Checkbox from 'material-ui/lib/checkbox';
import { SkosConcept } from '../models'
import Padding from '../../../../misc/components/Padding'
import makePureRender from '../../../../misc/makePureRender'
import { settings } from  '../ducks/filterConfigs'

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
  [settings.USER_DEFINED]: {
  },
  [settings.SELECT_ALWAYS]: {
    color: 'rgba(0, 0, 0, 0.3)'
  }
};

const PropertyFilterConfig = ({ skosConcept, count, countLoading, config, onSelect }) => {
  const countLabel = countLoading ? '?' :
    (count !== undefined ? count : '-');

  return <div>
    <Padding space={2}>
      <div style={Object.assign({}, labelStyle, configStyles[config])}>
        <Checkbox
          disabled={config == settings.SELECT_ALWAYS}
          defaultChecked={config == settings.SELECT_ALWAYS}
          onCheck={(_, isActive) => onSelect(isActive)}
          label={<span>
            {skosConcept.label}{' '}
            <span style={countStyle}>({countLabel})</span>
          </span>}
        />
      </div>
    </Padding>
    <Divider style={dividerStyle} />
  </div>
};

PropertyFilterConfig.propTypes = {
  skosConcept: PropTypes.instanceOf(SkosConcept).isRequired,
  count: PropTypes.number,
  countLoading: PropTypes.bool.isRequired,
  config: PropTypes.oneOf([settings.SELECT_ALWAYS, settings.USER_DEFINED]),
  onSelect: PropTypes.func.isRequired
};

PropertyFilterConfig.defaultProps = {
  config: settings.USER_DEFINED
};

export default makePureRender(PropertyFilterConfig);
