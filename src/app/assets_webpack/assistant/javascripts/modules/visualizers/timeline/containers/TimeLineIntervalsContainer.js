import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getIntervals, getIntervalsReset, intervalsSelector, intervalsStatusSelector } from '../ducks/intervals'
import { getIntervalsCount } from '../ducks/count'
import { limitSelector } from '../ducks/limit'
import { firstLevelSelector } from '../ducks/firstLevel'
import { PromiseStatus } from '../../../core/models'
import {createStructuredSelector} from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import TimeLine from '../misc/TimeLine'
import CenteredMessage from '../../../../components/CenteredMessage'

class TimeLineIntervalsContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.instanceOf(Boolean),

        // Levels
        firstLevel: PropTypes.instanceOf(Array).isRequired,

        // Intervals loading
        intervals: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        limit: PropTypes.instanceOf(Number).isRequired
    };

    componentWillMount() {
        const {dispatch, limit} = this.props;

        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, () => {
        }); // TODO: callback

        this.begin = new Date("2000-01-01");
        this.end = new Date("2018-01-01");

        if (this.props.isInitial) {
            dispatch(getIntervals([], this.start, this.end, limit))
            dispatch(getIntervalsCount([], this.start, this.end, this.limit));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevel, limit} = this.props;

        if (firstLevel != nextProps.firstLevel) {
            var urls = nextProps.firstLevel.map(t => t.inner);
            dispatch(getIntervals(urls, this.begin, this.end, limit));
            dispatch(getIntervalsCount(urls, this.begin, this.end, limit));
        }

        if (nextProps.status.done && nextProps.intervals != this.props.intervals) {
            this.needChartUpdate = true;
        }
    }

    componentDidUpdate() {
        const { intervals } = this.props;
        if (this.needChartUpdate) {
            this.chart.intervals(intervals);
        }
    }

    componentWillUnmount(){
        const {dispatch} = this.props;
        dispatch(getIntervalsReset());
        this.chart.destroy();
    }

    render() {
        const {status, intervals} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading intervals..."/>
        }

        else if (intervals.length == 0) {
            return <CenteredMessage>No intervals were loaded. Check the settings please.</CenteredMessage>
        }

        require('../misc/TimeLineStyle.css');
        return <div className={this.className}/>
    }
}

const selector = createStructuredSelector({
    intervals: intervalsSelector,
    status: intervalsStatusSelector,
    firstLevel: firstLevelSelector,
    limit: limitSelector
});

export default connect(selector)(TimeLineIntervalsContainer);