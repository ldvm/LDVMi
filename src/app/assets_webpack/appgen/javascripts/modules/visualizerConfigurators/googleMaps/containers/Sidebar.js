import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List } from 'immutable'
import { propertiesSelector, propertiesStatusSelector } from '../ducks/properties'
import { PromiseStatus } from '../../../../ducks/promises'
import { Application } from '../../../manageApp/models'
import PromiseResult from '../../../../misc/components/PromiseResult'
import SidebarTabs from '../components/SidebarTabs'
import PropertiesLoadingStatus from '../components/PropertiesLoadingStatus'

const Sidebar = ({ properties, propertiesStatus }) => {
  if (!propertiesStatus.done) {
    return <PropertiesLoadingStatus status={propertiesStatus} />;
  } else {
    return <SidebarTabs properties={properties} />;
  }
};

Sidebar.propTypes = {
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

export default connect(selector)(Sidebar);
