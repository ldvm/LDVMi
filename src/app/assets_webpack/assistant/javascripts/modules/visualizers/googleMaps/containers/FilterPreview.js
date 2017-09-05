import React, { PropTypes } from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import FilterHeader from '../components/FilterHeader'
import Option from '../components/Option'
import { createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { Filter, filterTypes as types, optionModes as modes } from '../models'
import { configureFilter, expandFilter } from '../ducks/filtersConfig'
import { selectOption, selectAllOptions } from '../ducks/optionsConfig'

import Padding from '../../../../components/Padding'

const FilterPreview = ({ dispatch, filter, status }) => {
  if (!filter.enabled) {
    return null;
  }

  const onSelect = filter.type == types.CHECKBOX ?
    (uri, selected) => dispatch(selectOption(filter.property.uri, uri, selected)) :
    (uri) => {
      // In the RADIO mode we first deselect all options and then we select the current one.
      dispatch(selectAllOptions(filter.property.uri, filter.optionsUris, false));
      dispatch(selectOption(filter.property.uri, uri, true));
    };

  return <div>
    <FilterHeader filter={filter}
      configureFilter={settings =>
        dispatch(configureFilter(filter.property.uri, settings))}
      expandFilter={expanded =>
        dispatch(expandFilter(filter.property.uri, expanded))}
      selectAllOptions={selected =>
        dispatch(selectAllOptions(filter.property.uri, filter.optionsUris, selected))}
    />

    {!status.done && (
      <Padding space={2}>
        <PromiseResult status={status} loadingMessage="Loading filter options..." />
      </Padding>
    )}

    {status.done && filter.expanded && filter.options.filter(option => option.mode != modes.SELECT_NEVER).toList().map(option =>
      <Option
        key={option.skosConcept.uri}
        option={option}
        type={filter.type}
        onSelect={selected => onSelect(option.skosConcept.uri, selected)}
      />
    )}
  </div>;
};

FilterPreview.propTypes = {
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

export default connect(selector)(FilterPreview);
