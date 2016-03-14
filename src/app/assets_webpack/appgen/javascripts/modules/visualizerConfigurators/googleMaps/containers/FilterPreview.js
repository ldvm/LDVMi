import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import PromiseResult from '../../../../misc/components/PromiseResult'
import FilterHeader from '../components/FilterHeader'
import Option from '../components/Option'
import { Filter, optionModes as modes } from '../models'
import { selectOption } from '../ducks/options'

const FilterPreview = ({ dispatch, filter }) => {
  if (!filter.optionsStatus.done) {
      return <PromiseResult status={filter.optionsStatus} />;
  }

  if (!filter.enabled) {
    return <div></div>;
  }

  return <div>
    <FilterHeader filter={filter} />
    {filter.options.filter(option => option.mode != modes.SELECT_NEVER).map(option =>
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
  filter: PropTypes.instanceOf(Filter).isRequired
};

export default connect()(FilterPreview);
