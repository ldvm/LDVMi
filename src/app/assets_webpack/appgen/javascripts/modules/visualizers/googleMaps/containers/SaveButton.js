import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import Button from '../../../../components/Button'
import { saveConfiguration, saveConfigurationStatusSelector } from '../ducks/configuration'
import { dirtySelector } from '../ducks/dirty'

const SaveButton = props => {
  const { dispatch, status, dirty } = props;
  const label = status.isLoading ? 'Saving changes...' :
    (dirty ? 'Save changes' : 'Changes saved');
  const icon = (!status.isLoading && !dirty) ? 'done_all' : 'done';

  return <Button success raised
     onTouchTap={() => dispatch(saveConfiguration())}
     disabled={status.isLoading || !dirty}
     icon={icon}
     label={label}
     {...props}
  />
};

SaveButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  dirty: PropTypes.bool.isRequired
};

const selector = createStructuredSelector({
  status: saveConfigurationStatusSelector,
  dirty: dirtySelector
});

export default connect(selector)(SaveButton);
