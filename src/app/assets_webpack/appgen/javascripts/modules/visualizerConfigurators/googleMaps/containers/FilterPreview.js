import React, { PropTypes } from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { PromiseStatus } from '../../../../ducks/promises'
import PromiseResult from '../../../../misc/components/PromiseResult'
import FilterHeader from '../components/FilterHeader'
import Option from '../components/Option'
import { createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import { Filter, optionModes as modes } from '../models'
import { selectOption } from '../ducks/optionsConfig'

const FilterPreview = ({ dispatch, filter, status }) => {
  if (!filter.enabled) {
    return <div></div>;
  }

  return <div>
    <FilterHeader filter={filter} />

    {!status.done && <PromiseResult status={status} />}

    {status.done && filter.options.filter(option => option.mode != modes.SELECT_NEVER).toList().map(option =>
      <Option
        key={option.skosConcept.uri}
        option={option}
        onSelect={selected => dispatch(selectOption(filter.property.uri, option.skosConcept.uri, selected))}
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
