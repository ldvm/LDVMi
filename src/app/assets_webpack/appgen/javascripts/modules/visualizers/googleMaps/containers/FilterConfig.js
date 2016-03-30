import React, { PropTypes } from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import { Filter } from '../models'
import { configureFilter } from '../ducks/filtersConfig'
import { createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { configureOption, configureAllOptions } from '../ducks/optionsConfig'
import FilterConfigHeader from '../components/FilterConfigHeader'
import OptionConfig from '../components/OptionConfig'

const FilterConfig = ({ dispatch, filter, status }) => {
  const { property } = filter;

  return <div>
    <FilterConfigHeader
      filter={filter}
      configureAllOptions={settings =>
        dispatch(configureAllOptions(property.uri, filter.optionsUris, settings))}
      configureFilter={settings =>
        dispatch(configureFilter(property.uri, settings))}
    />

    {!status.done && <PromiseResult status={status} />}

    {status.done && filter.enabled && filter.options.toList().map(option =>
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
  filter: PropTypes.instanceOf(Filter).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const skosConceptsStatusSelector = createSkosConceptsStatusSelector((_, props) =>
  props.filter.property.schemeUri);

const selector = createSelector(
  [skosConceptsStatusSelector],
  (status) => ({ status })
);

export default connect(selector)(FilterConfig);
