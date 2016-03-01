import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import Paper from 'material-ui/lib/paper';
import { List } from 'immutable'
import { propertiesSelector, propertiesStatusSelector } from '../ducks/properties'
import { PromiseStatus } from '../../../../ducks/promises'
import { Application } from '../../../manageApp/models'
import PromiseResult from '../../../../misc/components/PromiseResult'
import FilterTabs from '../components/FilterTabs'

const Filters = ({ properties, propertiesStatus }) => {
  return (
    <Paper zDepth={2}>
      {!propertiesStatus.done &&
        <PromiseResult status={propertiesStatus} />
      }

      {propertiesStatus.done &&
        <FilterTabs properties={properties} />
      }
    </Paper>
  )
};

Filters.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired,
  properties: PropTypes.instanceOf(List),
  propertiesStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createSelector(
  [propertiesSelector, propertiesStatusSelector],
  (properties, propertiesStatus) => ({
    properties,
    propertiesStatus
  })
);

export default connect(selector)(Filters);
