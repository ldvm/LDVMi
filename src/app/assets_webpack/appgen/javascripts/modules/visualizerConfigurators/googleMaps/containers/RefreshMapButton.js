import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getMarkers } from '../ducks/markers'
import { Application } from '../../../manageApp/models'
import Button from '../../../../misc/components/Button'

const RefreshMapButton = ({ dispatch, application, mapQueryData }) => {
  // console.log(mapQueryData);
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
  [],
  () => {
    // TODO: do something better and smarter
    return { mapQueryData: {}};
  }
);

export default connect(selector)(RefreshMapButton);
