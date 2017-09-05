import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { quantifiedThingsCountSelector, quantifiedThingsCountStatusSelector } from '../ducks/counts'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import { getDistinctCount } from '../../../common/utils/arrayUtils'
import { quantifiedThingsSelector, quantifiedThingsStatusSelector } from '../ducks/quantifiedThings'

class CountThingsContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    quantifiedThings: PropTypes.array.isRequired,
    quantifiedThingsStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

    count: PropTypes.number.isRequired,
    countStatus: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  render() {
    const { count, countStatus, quantifiedThings, quantifiedThingsStatus } = this.props;

    if (!countStatus.done) {
      return <PromiseResult status={countStatus} error={countStatus.error}
                            loadingMessage="Loading things count..."/>
    }

    if (!quantifiedThingsStatus.done) {
      return <PromiseResult status={quantifiedThingsStatus} error={quantifiedThingsStatus.error}
                            loadingMessage="Loading things ..."/>
    }

    var loaded = getDistinctCount(t => t.url, quantifiedThings);
    return <CenteredMessage>
      Loaded {loaded} records out of {count} available. Increase limit to load more.
    </CenteredMessage>
  }
}

const selector = createStructuredSelector({
  quantifiedThings: quantifiedThingsSelector,
  quantifiedThingsStatus: quantifiedThingsStatusSelector,

  count: quantifiedThingsCountSelector,
  countStatus: quantifiedThingsCountStatusSelector,
});

export default connect(selector)(CountThingsContainer);
