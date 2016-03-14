import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import PromiseResult from '../../../../misc/components/PromiseResult'
import { Filter } from '../models'
import { configureFilter } from '../ducks/filters'
import { configureOption, configureAllOptions } from '../ducks/options'
import FilterConfigHeader from '../components/FilterConfigHeader'
import OptionConfig from '../components/OptionConfig'

const FilterConfig = ({ dispatch, filter }) => {
  const { property } = filter;

  if (!filter.optionsStatus.done) {
      return <PromiseResult status={filter.optionsStatus} />;
  }

  return <div>
    <FilterConfigHeader
      filter={filter}
      configureAllOptions={settings =>
        dispatch(configureAllOptions(property.uri, filter.optionsUris, settings))}
      configureFilter={settings =>
        dispatch(configureFilter(property.uri, settings))}
    />
    {filter.enabled && filter.options.map(option =>
      <OptionConfig
        key={option.skosConcept.uri}
        option={option}
        configureOption={settings =>
          dispatch(configureOption(property.uri, option.skosConcept.uri, settings))}
      />
    )}
  </div>;
};

FilterConfig.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Filter).isRequired
};

export default connect()(FilterConfig);
