import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { TimeRange } from '../models'
import { getInstants, getInstantsReset, instantsSelector, instantsStatusSelector } from '../ducks/instants'
import { getInstantsCount } from '../ducks/count'
import { limitSelector } from '../../../app/ducks/limit'
import { setTimeRangeReset, timeRangeSelector } from '../ducks/timeRange'
import { firstLevelSelector } from '../ducks/firstLevel'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import CountZeroLevelContainer from './CountZeroLevelContainer'
import TimeRangeContainer from './TimeRangeContainer'
import { Paper } from 'material-ui'

class InstantsLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isInitial: PropTypes.bool,

    // Levels
    firstLevel: PropTypes.instanceOf(Array).isRequired,

    // Instants loading
    instants: PropTypes.instanceOf(Array).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // Loading settings
    timeRange: PropTypes.instanceOf(TimeRange).isRequired,
    limit: PropTypes.number.isRequired
  };

  componentWillMount() {
    const { dispatch, timeRange, limit } = this.props;

    // Load data only if this loader is initial (responsible for the first load)
    if (this.props.isInitial) {
      dispatch(getInstants([], timeRange, limit));
      dispatch(getInstantsCount([], timeRange));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, firstLevel, timeRange, limit } = this.props;

    if (firstLevel != nextProps.firstLevel || timeRange != nextProps.timeRange) {
      var urls = nextProps.firstLevel.map(t => t.inner);
      dispatch(getInstants(urls, nextProps.timeRange, limit));
      dispatch(getInstantsCount(urls, nextProps.timeRange));
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(getInstantsReset());
    dispatch(setTimeRangeReset());
  }

  render() {
    const { status, instants } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error} loadingMessage="Loading instants..."/>
    }

    if (instants.length == 0) {
      return <Paper>
        <TimeRangeContainer/>
        <CenteredMessage>No instants loaded.</CenteredMessage>
      </Paper>
    }

    return <Paper>
      <TimeRangeContainer/>
      <CountZeroLevelContainer/>
    </Paper>
  }
}

const selector = createStructuredSelector({
  instants: instantsSelector,
  status: instantsStatusSelector,
  firstLevel: firstLevelSelector,
  timeRange: timeRangeSelector,
  limit: limitSelector
});

export default connect(selector)(InstantsLoader);