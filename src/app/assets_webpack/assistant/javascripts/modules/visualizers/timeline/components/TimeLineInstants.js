import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PromiseStatus } from '../../../core/models'
import { instantsSelector, instantsStatusSelector } from '../ducks/instants'
import { firstLevelSelector, firstLevelStatusSelector } from '../ducks/firstLevel'
import { setSelectTimeRecord } from '../ducks/selectedTimeRecord'
import TimeLine from '../misc/TimeLine'
import CenteredMessage from '../../../../components/CenteredMessage'
import { secondLevelSelector, secondLevelStatusSelector } from '../ducks/secondLevel'
import { getLeveledInstants } from '../misc/TimeLineUtils'
import { Paper } from 'material-ui'
import PromiseResult from '../../../core/components/PromiseResult'
import { colorsSelector, setColors, setColorsReset } from '../ducks/colors'
import { Map as ImmutableMap } from 'immutable'
import { createAggregatedPromiseStatusSelector } from '../../../core/ducks/promises'

class TimeLineInstants extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    // Levels
    instants: PropTypes.array.isRequired,
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
    if (this.props.instants != nextProps.instants) {
      this.needChartUpdate = true;
    }
    if (this.props.colors != nextProps.colors) {
      this.colors = nextProps.colors;
    }
  }

  componentDidUpdate() {
    const { dispatch } = this.props;

    if (this.needChartUpdate) {

      // Levels
      var MAX_GRAPH_LEVELS = 8;
      var insToRender = getLeveledInstants(this.props.instants, MAX_GRAPH_LEVELS);

      // Colors
      insToRender = this.addColors(insToRender);
      if (this.props.colors != this.colors) {
        dispatch(setColors(this.colors));
      }

      this.chart.destroy();
      this.chart.instants(insToRender);

      this.needChartUpdate = false;
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(setColorsReset());
    this.chart.destroy();
  }

  render() {
    const { instants, status } = this.props;

    if (status.isLoading) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading data..."/>
    }

    if (instants.length == 0) {
      return <CenteredMessage>No instants loaded. Check settings.</CenteredMessage>
    }

    require('../misc/TimeLineStyle.css');
    return <Paper>
      <div className={this.className}/>
    </Paper>
  }
}

const statusSelector = createAggregatedPromiseStatusSelector(
  [instantsStatusSelector, firstLevelStatusSelector, secondLevelStatusSelector]
);

const selector = createStructuredSelector({
  instants: instantsSelector,
  firstLevel: firstLevelSelector,
  secondLevel: secondLevelSelector,
  status: statusSelector,
  colors: colorsSelector
});

export default connect(selector)(TimeLineInstants);