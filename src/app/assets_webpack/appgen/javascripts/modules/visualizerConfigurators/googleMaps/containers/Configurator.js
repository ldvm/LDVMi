import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Application } from '../../../manageApp/models'
import { Visualizer } from '../../../common/models'
import * as api from '../api'

class Configurator extends Component {
  componentWillMount() {
    const { application } = this.props;
    api.getProperties(application.id)
      .then(properties => {
        properties.forEach(property => {
          api.getSkosConcepts(application.id, [property.schemeUri])
            .then(skosConcepts => {
              const conceptUris = skosConcepts[property.schemeUri].map(concept => concept.uri);
              api.getSkosConceptsCounts(application.id, property.uri, conceptUris);
            });
        });
      });
  }

  render() {
    return <div>
      Maps Visualizer Configurator!
    </div>;
  }
}

Configurator.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  dispatch: PropTypes.func.isRequired
};

export default connect()(Configurator);
