import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { countFirstSelector, countFirstStatusSelector } from '../ducks/count'
import { firstLevelSelector, firstLevelStatusSelector } from '../ducks/firstLevel'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import { getDistinctCount } from '../../../common/utils/arrayUtils'

class CountFirstLevelContainer extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    count: PropTypes.number.isRequired,
    countStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

    things: PropTypes.instanceOf(Array).isRequired,
    thingsStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
  };

  render() {
    const { count, countStatus, things, thingsStatus } = this.props;

    if (!countStatus.done) {
      return <PromiseResult status={countStatus} error={countStatus.error} loadingMessage="Loading count..."/>
    }

    if (!thingsStatus.done) {
      return <PromiseResult status={thingsStatus} error={thingsStatus.error}
                            loadingMessage="Loading connected records..."/>
    }

    var loaded = getDistinctCount(t => t.outer, things);
    return <CenteredMessage>
      Loaded {loaded} records out of {count} available. Increase limit to load more.
    </CenteredMessage>
  }
}

const selector = createStructuredSelector({
  count: countFirstSelector,
  countStatus: countFirstStatusSelector,

  things: firstLevelSelector,
  thingsStatus: firstLevelStatusSelector
});

export default connect(selector)(CountFirstLevelContainer);
