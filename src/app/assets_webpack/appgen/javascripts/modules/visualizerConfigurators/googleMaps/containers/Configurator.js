import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../common/models'
import * as api from '../api'
import { queryDataset } from '../actions'
import Sidebar from './Sidebar'

class Configurator extends Component {
  componentWillMount() {
    const { dispatch, application } = this.props;
    dispatch(queryDataset(application.id));
  }

  render() {
    const { application } = this.props;
    return <Row>
      <Col md={3}>
        <Sidebar application={application} />
      </Col>
      <Col md={9}>
        Maps Visualizer Configurator!
      </Col>
    </Row>;
  }
}

Configurator.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(Configurator);
