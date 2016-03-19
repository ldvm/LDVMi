import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../../ducks/promises'
import Button from '../../../../misc/components/Button'
import { getMarkers, markersStatusSelector } from '../ducks/markers'
import { dirtySelector } from '../ducks/dirty'

const RefreshMapButton = props => {
  const { dispatch, status, dirty } = props;
  const label = status.isLoading ? 'Saving changes...' :
    (dirty ? 'Save changes' : 'Changes saved');
  const icon = (!status.isLoading && !dirty) ? 'done_all' : 'done';

  return <Button success raised
     onTouchTap={() => dispatch(getMarkers())}
     disabled={status.isLoading || !dirty}
     icon={icon}
     label={label}
     {...props}
  />
};

RefreshMapButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired, // TODO: change to the correct promise
  dirty: PropTypes.bool.isRequired
};

const selector = createStructuredSelector({
  status: markersStatusSelector,
  dirty: dirtySelector
});

export default connect(selector)(RefreshMapButton);
