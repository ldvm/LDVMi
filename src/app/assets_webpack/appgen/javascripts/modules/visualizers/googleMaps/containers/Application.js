import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-flexbox-grid'
import { Visualizer } from '../../../core/models'
import * as api from '../api'
import { queryDataset } from '../actions'
import { getConfiguration } from '../ducks/configuration'
import Layout from '../components/Layout'

class Application extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(queryDataset());
    dispatch(getConfiguration());
  }

  render() {
    const { embed } = this.props;

    return <Layout
      insetShadow={!embed}
    />;
  }
}

Application.propTypes = {
  dispatch: PropTypes.func.isRequired,
  embed: PropTypes.bool
};

export default connect()(Application);
