import React, { Component, PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { TimeRange } from '../models'
import { getIntervals, getIntervalsReset, intervalsSelector, intervalsStatusSelector } from '../ducks/intervals'
import { getIntervalsCount } from '../ducks/count'
import { limitSelector } from '../../../app/ducks/limit'
import { setTimeRangeReset, timeRangeSelector } from '../ducks/timeRange'
import { firstLevelSelector } from '../ducks/firstLevel'
import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import CountZeroLevelContainer from './CountZeroLevelContainer'
import TimeRangeContainer from './TimeRangeContainer'
import { Paper } from 'material-ui'
import { connect } from 'react-redux'

class IntervalsLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isInitial: PropTypes.bool,

    // Levels
    firstLevel: PropTypes.instanceOf(Array).isRequired,

    // Instants loading
    intervals: PropTypes.instanceOf(Array).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // Loading settings
    timeRange: PropTypes.instanceOf(TimeRange).isRequired,
    limit: PropTypes.number.isRequired
  };

  componentWillMount() {
    const { dispatch, timeRange, limit } = this.props;

    // Load data only if this loader is initial (responsible for the first load)
    if (this.props.isInitial) {
      dispatch(getIntervals([], timeRange, limit));
      dispatch(getIntervalsCount([], timeRange));
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, firstLevel, timeRange, limit } = this.props;

    if (firstLevel != nextProps.firstLevel || timeRange != nextProps.timeRange) {
      var urls = nextProps.firstLevel.map(t => t.inner);
      dispatch(getIntervals(urls, nextProps.timeRange, limit));
      dispatch(getIntervalsCount(urls, nextProps.timeRange));
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(getIntervalsReset());
    dispatch(setTimeRangeReset());
  }

  render() {
    const { status, intervals } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error} loadingMessage="Loading intervals..."/>
    }

    if (intervals.length == 0) {
      return <Paper>
        <TimeRangeContainer/>
        <CenteredMessage>No intervals loaded.</CenteredMessage>
      </Paper>
    }

    require('../misc/TimeLineStyle.css');
    return <Paper>
      <TimeRangeContainer/>
      <CountZeroLevelContainer/>
    </Paper>
  }
}

const selector = createStructuredSelector({
  intervals: intervalsSelector,
  status: intervalsStatusSelector,
  firstLevel: firstLevelSelector,
  timeRange: timeRangeSelector,
  limit: limitSelector
});

export default connect(selector)(IntervalsLoader);
