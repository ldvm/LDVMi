import React, { Component, PropTypes } from 'react'
import { Map } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { queryDataset } from '../actions'
import { getConfiguration } from '../ducks/configuration'
import { filtersSelector } from '../ducks/filters'
import { propertiesStatusSelector } from '../ducks/properties'
import { PromiseStatus } from '../../../core/models'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import SidebarTabs from '../components/SidebarTabs'
import PropertiesLoadingStatus from '../components/PropertiesLoadingStatus'

class Configurator extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(queryDataset());
    dispatch(getConfiguration());
  }

  render() {
    const { filters, status } = this.props;

    if (!status.done) {
      return <Layout insetShadow
                     sidebar={<PropertiesLoadingStatus status={status}/>}
      />;
    }

    return <Layout insetShadow
                   toolbar={<Toolbar />}
                   sidebar={<SidebarTabs filters={filters}/>}
    />;
  }
}

Configurator.propTypes = {
  filters: PropTypes.instanceOf(Map),
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  dispatch: PropTypes.func.isRequired
};

const selector = createStructuredSelector({
  filters: filtersSelector,
  status: propertiesStatusSelector
});

export default connect(selector)(Configurator);
