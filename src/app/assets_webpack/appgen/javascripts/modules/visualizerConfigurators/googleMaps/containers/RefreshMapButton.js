import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { selectedFiltersSelector } from '../ducks/selectedFilters'
import { getMarkers } from '../ducks/markers'
import { Application } from '../../../manageApp/models'
import Button from '../../../../misc/components/Button'
import { propertiesSelector } from '../ducks/properties'
import { skosConceptsSelector } from '../ducks/skosConcepts'

const RefreshMapButton = ({ dispatch, application, mapQueryData }) => {
  console.log(mapQueryData);
  return <Button warning raised
     onTouchTap={() => dispatch(getMarkers(application.id, mapQueryData))}
     fullWidth icon="refresh"
     label="Refresh map" />
};

RefreshMapButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired,
  mapQueryData: PropTypes.object.isRequired
};

const selector = createSelector(
  [propertiesSelector, skosConceptsSelector, selectedFiltersSelector],
  (properties, skosConcepts, selectedFilters) => {
    // TODO: do something better and smarter
    let emptyFilters = new Map();
    properties.forEach(property => {
      emptyFilters = emptyFilters.set(property.uri,
        (skosConcepts.get(property.schemeUri) || new List()).map(concept =>
          new Map({ uri: concept.uri, isActive: false })
        ))
    });

    return { mapQueryData: { filters: emptyFilters.mergeDeep(selectedFilters).toJS() } };
  }
);

export default connect(selector)(RefreshMapButton);
