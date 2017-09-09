import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { quantifiedPlacesCountSelector, quantifiedPlacesCountStatusSelector } from '../ducks/counts'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import { getDistinctCount } from '../../../common/utils/arrayUtils'
import { quantifiedPlacesSelector, quantifiedPlacesStatusSelector } from '../ducks/quantifiedPlaces'

class CountQuantifiersContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    quantifiedPlaces: PropTypes.array.isRequired,
    quantifiedPlacesStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

    count: PropTypes.number.isRequired,
    countStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  render() {
    const { count, countStatus, quantifiedPlaces, quantifiedPlacesStatus } = this.props;

    if (!countStatus.done) {
      return <PromiseResult status={countStatus} error={countStatus.error}
                            loadingMessage="Loading quantified places count..."/>
    }

    if (!quantifiedPlacesStatus.done) {
      return <PromiseResult status={quantifiedPlacesStatus} error={quantifiedPlacesStatus.error}
                            loadingMessage="Loading quantified places ..."/>
    }

    var loaded = getDistinctCount(t => t.url, quantifiedPlaces);
    return <CenteredMessage>
      Loaded {loaded} records out of {count} available. Increase limit to load more.
    </CenteredMessage>
  }
}

const selector = createStructuredSelector({
  quantifiedPlaces: quantifiedPlacesSelector,
  quantifiedPlacesStatus: quantifiedPlacesStatusSelector,

  count: quantifiedPlacesCountSelector,
  countStatus: quantifiedPlacesCountStatusSelector
});

export default connect(selector)(CountQuantifiersContainer);
