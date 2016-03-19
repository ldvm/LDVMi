import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../common/models'
import * as api from '../api'
import { queryDataset } from '../actions'
import { getConfiguration } from '../ducks/configuration'
import ConfiguratorLayout from '../components/ConfiguratorLayout'

class Configurator extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(queryDataset());
    dispatch(getConfiguration());
  }

  render() {
    return <ConfiguratorLayout />;
  }
}

Configurator.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(Configurator);
