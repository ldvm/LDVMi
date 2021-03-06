import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import ConfiguratorToolbar from '../components/ConfiguratorToolbar'

const Configurator = (props) => {
  return <div>
    <ConfiguratorToolbar />
  </div>;
};

Configurator.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(Configurator);
