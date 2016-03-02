import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List } from 'immutable'
import { PromiseStatus } from '../../../../ducks/promises'
import PromiseResult from '../../../../misc/components/PromiseResult'
import { Property } from '../models'
import { skosConceptsSelector, createSkosConceptsStatusSelector } from '../ducks/skosConcepts'
import FilterConfig from '../components/FilterConfig'

const PropertyFilter = ({ property, skosConcepts, status }) => {
  if (!status.done) {
      return <PromiseResult status={status} />;
  }

  return <div>
    {skosConcepts.map(skosConcept =>
      <FilterConfig skosConcept={skosConcept} key={skosConcept.uri} />
    )}
  </div>;
};

PropertyFilter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  property: PropTypes.instanceOf(Property).isRequired,
  skosConcepts: PropTypes.instanceOf(List).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const propertySelector = (state, props) => props.property;

const skosConceptsStatusSelector = createSkosConceptsStatusSelector(
  (state, props) => props.property.schemeUri);

const selector = createSelector(
  [propertySelector, skosConceptsSelector, skosConceptsStatusSelector],
  (property, skosConcepts, status) => ({
    property,
    skosConcepts: skosConcepts.get(property.schemeUri),
    status
  })
);

export default connect(selector)(PropertyFilter);
