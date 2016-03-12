import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../common/models'
import * as api from '../api'
import { queryDataset } from '../actions'
import ConfiguratorLayout from '../components/ConfiguratorLayout'

class Configurator extends Component {
  componentWillMount() {
    const { dispatch, application } = this.props;
    dispatch(queryDataset(application.id));
  }

  render() {
    return <ConfiguratorLayout application={this.props.application} />;
  }
}

Configurator.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(Configurator);
