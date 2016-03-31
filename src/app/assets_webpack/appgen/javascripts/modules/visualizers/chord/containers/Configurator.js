import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../core/models'

const Configurator = ({ application, visualizer }) => {
  return <div>
    {application.name} <br />
    {visualizer.title} <br />
  </div>;
};

Configurator.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(Configurator);
