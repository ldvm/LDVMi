import React, { PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import { Filter } from '../models'
import { configureFilter } from '../ducks/filtersConfig'
import { createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { configureOption, configureAllOptions } from '../ducks/optionsConfig'
import FilterHeader from '../components/FilterHeader'
import OptionConfig from '../components/OptionConfig'
import Padding from '../../../../components/Padding'

const FilterConfig = ({ dispatch, filter, status }) => {
  const { property } = filter;

  return <div>
    <FilterHeader configurable filter={filter}
      configureAllOptions={settings =>
        dispatch(configureAllOptions(property.uri, filter.optionsUris, settings))}
      configureFilter={settings =>
        dispatch(configureFilter(property.uri, settings))}
    />

    {!status.done && (
      <Padding space={2}>
        <PromiseResult status={status} loadingMessage="Loading filter options..." />
      </Padding>
    )}

    {status.done && filter.enabled && filter.expanded && filter.options.map(option =>
      <OptionConfig
        key={option.skosConcept.uri}
        option={option}
        configureOption={settings =>
          dispatch(configureOption(property.uri, option.skosConcept.uri, settings))}
      />
    ).toList()}
  </div>;
};

FilterConfig.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filter: PropTypes.instanceOf(Filter).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const skosConceptsStatusSelector = createSkosConceptsStatusSelector((_, props) =>
  props.filter.property.schemeUri);

const selector = createStructuredSelector({
  status: skosConceptsStatusSelector
});

export default connect(selector)(FilterConfig);
