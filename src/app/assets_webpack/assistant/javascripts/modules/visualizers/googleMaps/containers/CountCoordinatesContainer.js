import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { coordinatesCountSelector, coordinatesCountStatusSelector } from '../ducks/counts'
import { coordinatesSelector, coordinatesStatusSelector } from '../ducks/coordinates'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import { getDistinctCount } from '../../../common/utils/arrayUtils'

class CountCoordinatesContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    coordinates: PropTypes.array.isRequired,
    coordinatesStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

    count: PropTypes.number.isRequired,
    countStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  render() {
    const { count, countStatus, coordinates, coordinatesStatus } = this.props;

    if (!countStatus.done) {
      return <PromiseResult status={countStatus} error={countStatus.error}
                            loadingMessage="Loading coordinates count..."/>
    }

    if (!coordinatesStatus.done) {
      return <PromiseResult status={coordinatesStatus} error={coordinatesStatus.error}
                            loadingMessage="Loading coordinates ..."/>
    }

    var loaded = getDistinctCount(t => t.url, coordinates);
    return <CenteredMessage>
      Loaded {loaded} records out of {count} available. Increase limit to load more.
    </CenteredMessage>
  }
}

const selector = createStructuredSelector({
  coordinates: coordinatesSelector,
  coordinatesStatus: coordinatesStatusSelector,

  count: coordinatesCountSelector,
  countStatus: coordinatesCountStatusSelector
});

export default connect(selector)(CountCoordinatesContainer);
