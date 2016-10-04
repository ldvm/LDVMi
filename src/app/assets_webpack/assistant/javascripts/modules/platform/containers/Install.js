import React, { Component, PropTypes } from 'react'
import { List } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { visualizersSelector, visualizersStatusSelector } from '../../core/ducks/visualizers'
import { install, installResultsSelector, installStatusSelector } from '../ducks/install'
import InstallCard from '../components/InstallCard'
import { PromiseStatus } from '../../core/models'

class Install extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    visualizers: PropTypes.instanceOf(List).isRequired,
    visualizersStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
    installResults: PropTypes.instanceOf(List).isRequired,
    installStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  render() {
    const { dispatch, visualizers, visualizersStatus, installResults, installStatus } = this.props;
    return (visualizersStatus.done && visualizers.size == 0) || installStatus.done ?
      <InstallCard
        install={() => dispatch(install())}
        installResults={installResults}
        installStatus={installStatus}
      /> : null;
  }
}

const selector = createStructuredSelector({
  visualizers: visualizersSelector,
  visualizersStatus: visualizersStatusSelector,
  installResults: installResultsSelector,
  installStatus: installStatusSelector
});

export default connect(selector)(Install);
