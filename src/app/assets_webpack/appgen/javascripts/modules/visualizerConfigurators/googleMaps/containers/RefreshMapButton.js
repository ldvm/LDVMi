import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../../ducks/promises'
import { Application } from '../../../manageApp/models'
import Button from '../../../../misc/components/Button'
import { getMarkers, markersStatusSelector } from '../ducks/markers'

const RefreshMapButton = props => {
  const { dispatch, status } = props;
  const label = status.isLoading ? 'Refreshing map...' : 'Refresh map';

  return <Button warning raised
     onTouchTap={() => dispatch(getMarkers())}
     disabled={status.isLoading}
     icon="refresh"
     label={label}
     {...props}
  />
};

RefreshMapButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createStructuredSelector({
  status: markersStatusSelector
});

export default connect(selector)(RefreshMapButton);
