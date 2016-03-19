import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../../ducks/promises'
import Button from '../../../../misc/components/Button'
import { getMarkers, markersStatusSelector } from '../ducks/markers'
import { propertiesStatusSelector } from '../ducks/properties'

const RefreshMapButton = props => {
  const { dispatch, markersStatus, propertiesStatus} = props;
  const label = markersStatus.isLoading ? 'Refreshing map...' : 'Refresh map';

  return <Button warning raised
     onTouchTap={() => dispatch(getMarkers())}
     disabled={markersStatus.isLoading || propertiesStatus.isLoading}
     icon="refresh"
     label={label}
     {...props}
  />
};

RefreshMapButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  markersStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
  propertiesStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createStructuredSelector({
  markersStatus: markersStatusSelector,
  propertiesStatus: propertiesStatusSelector
});

export default connect(selector)(RefreshMapButton);
