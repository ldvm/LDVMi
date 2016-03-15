import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List, Map } from 'immutable'
import { propertiesStatusSelector } from '../ducks/properties'
import { filtersSelector } from '../ducks/filters'
import { PromiseStatus } from '../../../../ducks/promises'
import { Application } from '../../../manageApp/models'
import PromiseResult from '../../../../misc/components/PromiseResult'
import SidebarTabs from '../components/SidebarTabs'
import PropertiesLoadingStatus from '../components/PropertiesLoadingStatus'

const Sidebar = ({ application, filters, status}) => {
  if (!status.done) {
    return <PropertiesLoadingStatus status={status} />;
  } else {
    return <SidebarTabs application={application} filters={filters} />;
  }
};

Sidebar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired,
  filters: PropTypes.instanceOf(List),
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createSelector(
  [filtersSelector, propertiesStatusSelector],
  (filters, status) => ({ filters, status })
);

export default connect(selector)(Sidebar);
