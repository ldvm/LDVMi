import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { placesCountSelector, placesCountStatusSelector } from '../ducks/counts'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import { getDistinctCount } from '../../../common/utils/arrayUtils'
import { placesSelector, placesStatusSelector } from '../ducks/places'

class CountPlacesContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    places: PropTypes.array.isRequired,
    placesStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

    count: PropTypes.number.isRequired,
    countStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  render() {
    const { count, countStatus, places, placesStatus } = this.props;

    if (!countStatus.done) {
      return <PromiseResult status={countStatus} error={countStatus.error}
                            loadingMessage="Loading places count..."/>
    }

    if (!placesStatus.done) {
      return <PromiseResult status={placesStatus} error={placesStatus.error}
                            loadingMessage="Loading places ..."/>
    }

    var loaded = getDistinctCount(t => t.url, places);
    return <CenteredMessage>
      Loaded {loaded} records out of {count} available. Increase limit to load more.
    </CenteredMessage>
  }
}

const selector = createStructuredSelector({
  places: placesSelector,
  placesStatus: placesStatusSelector,

  count: placesCountSelector,
  countStatus: placesCountStatusSelector,
});

export default connect(selector)(CountPlacesContainer);
