import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { List, Map } from 'immutable'
import { propertiesStatusSelector } from '../ducks/properties'
import { filtersSelector } from '../ducks/filters'
import { PromiseStatus } from '../../../core/models'
import { Application } from '../../../manageApp/models'
import PromiseResult from '../../../../misc/components/PromiseResult'
import SidebarTabs from '../components/SidebarTabs'
import PropertiesLoadingStatus from '../components/PropertiesLoadingStatus'

const Sidebar = ({ filters, status}) => {
  if (!status.done) {
    return <PropertiesLoadingStatus status={status} />;
  } else {
    return <SidebarTabs filters={filters} />;
  }
};

Sidebar.propTypes = {
  dispatch: PropTypes.func.isRequired,
  filters: PropTypes.instanceOf(Map),
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createSelector(
  [filtersSelector, propertiesStatusSelector],
  (filters, status) => ({ filters, status })
);

export default connect(selector)(Sidebar);
