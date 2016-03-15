import React, { PropTypes } from 'react'
import { Map, List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../../ducks/promises'
import { Application } from '../../../manageApp/models'
import Button from '../../../../misc/components/Button'
import { getMarkers, markersStatusSelector } from '../ducks/markers'

const RefreshMapButton = ({ dispatch, application, filters, status }) => {
  const label = status.isLoading ? 'Refreshing map...' : 'Refresh map';

  return <Button warning raised
     onTouchTap={() => dispatch(getMarkers(application.id, filters ))}
     disabled={status.isLoading}
     fullWidth icon="refresh"
     label={label} />
};

RefreshMapButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired,
  filters: PropTypes.instanceOf(Map),
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createStructuredSelector({
  status: markersStatusSelector
});

export default connect(selector)(RefreshMapButton);
