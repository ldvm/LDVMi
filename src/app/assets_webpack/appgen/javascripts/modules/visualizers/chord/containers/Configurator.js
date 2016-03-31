import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../core/models'
import * as api from '../api'

class Configurator extends Component {
  static propTypes = {
    application: PropTypes.instanceOf(Application).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    dispatch: PropTypes.func.isRequired
  };

  componentWillMount() {
    const { application } = this.props;
    api.getEdges(application.id);
  }


  render() {
    const { application, visualizer } = this.props;
    return <div>
      {application.name} <br />
      {visualizer.title} <br />
    </div>;
  }
}

export default connect()(Configurator);
