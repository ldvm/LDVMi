import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { firstLevelSelector, firstLevelStatusSelector } from '../ducks/firstLevel'
import { setSelectTimeRecord } from '../ducks/selectedTimeRecord'
import TimeLine from '../misc/TimeLine'
import CenteredMessage from '../../../../components/CenteredMessage'
import { secondLevelSelector, secondLevelStatusSelector } from '../ducks/secondLevel'
import { getLeveledIntervals } from '../misc/TimeLineUtils'
import { Paper } from 'material-ui'
import PromiseResult from '../../../core/components/PromiseResult'
import { intervalsSelector, intervalsStatusSelector } from '../ducks/intervals'
import { colorsSelector, setColors, setColorsReset } from '../ducks/colors'
import { Map as ImmutableMap } from 'immutable'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'

class TimeLineIntervals extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    // Levels
    intervals: PropTypes.array.isRequired,
    firstLevel: PropTypes.array.isRequired,
    secondLevel: PropTypes.array.isRequired,

    // Loading status
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    colors: PropTypes.instanceOf(ImmutableMap).isRequired
  };

  getColor(url) {
    if (this.colors.has(url)) {
      return this.colors.get(url);
    }
    else {
      var color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      this.colors = this.colors.set(url, color);
      return color;
    }
  }

  addColors(intervals) {
    const { firstLevel } = this.props;
    for (var i of intervals) {
      var found = false;

      // try finding matching first level record and get color
      for (var d of firstLevel) {
        if (d.inner == i.url) {
          i.fill = this.getColor(d.outerType);
          i.stroke = this.getColor(d.predicate);

          found = true;
          break;
        }
      }

      // Otherwise get defaults
      if (!found) {
        i.fill = this.getColor('default_type');
        i.stroke = this.getColor('default_predicate');
      }
    }
    return intervals;
  }

  componentWillMount() {
    const { dispatch } = this.props;

    this.className = 'time-series-chart';
    this.chart = new TimeLine(this.className, (r) => dispatch(setSelectTimeRecord(r)));
  }

  componentDidMount() {
    this.colors = this.props.colors;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.intervals != nextProps.intervals) {
      this.needChartUpdate = true;
    }
    if (nextProps.colors != this.props.colors) {
      this.colors = nextProps.colors;
    }
  }

  componentDidUpdate() {
    const { dispatch } = this.props;
    if (this.needChartUpdate) {

      // Levels
      var MAX_GRAPH_LEVELS = 8;
      var intToRender = getLeveledIntervals(this.props.intervals, MAX_GRAPH_LEVELS);

      // Colors
      intToRender = this.addColors(intToRender);
      if (this.props.colors != this.colors) {
        dispatch(setColors(this.colors));
      }

      // Chart update
      this.chart.destroy();
      this.chart.intervals(intToRender);

      this.needChartUpdate = false;
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setColorsReset());
    this.chart.destroy();
  }

  render() {
    const { intervals, status } = this.props;

    if (status.isLoading) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading data..."/>
    }

    if (intervals.length == 0) {
      return <CenteredMessage>No intervals loaded. Check settings.</CenteredMessage>
    }

    require('../misc/TimeLineStyle.css');
    return <Paper>
      <div className={this.className}/>
    </Paper>
  }
}

const statusSelector = createAggregatedPromiseStatusSelector(
  [intervalsStatusSelector, firstLevelStatusSelector, secondLevelStatusSelector]
);

const selector = createStructuredSelector({
  intervals: intervalsSelector,
  firstLevel: firstLevelSelector,
  secondLevel: secondLevelSelector,
  status: statusSelector,
  colors: colorsSelector
});

export default connect(selector)(TimeLineIntervals);