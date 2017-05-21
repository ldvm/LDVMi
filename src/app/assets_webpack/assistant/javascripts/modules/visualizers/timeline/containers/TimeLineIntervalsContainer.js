import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {PromiseStatus} from "../../../core/models";
import {TimeRange} from "../models";

import {getIntervals, getIntervalsReset, intervalsSelector, intervalsStatusSelector} from "../ducks/intervals";
import {getIntervalsCount} from "../ducks/count";
import {limitSelector} from "../ducks/limit";
import {getSelectedTimeReset, timeRangeSelector} from "../ducks/timeRange";
import {firstLevelSelector} from "../ducks/firstLevel";
import {getSelectTimeRecordReset, setSelectTimeRecord} from "../ducks/selectedTimeRecord";

import PromiseResult from "../../../core/components/PromiseResult";
import TimeLine from "../misc/TimeLine";
import CenteredMessage from "../../../../components/CenteredMessage";
import CountZeroLevelContainer from "./CountZeroLevelContainer";
import TimeRangeContainer from "./TimeRangeContainer";
import {Paper} from "material-ui";

class TimeLineIntervalsContainer extends Component {
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
        const {dispatch, timeRange, limit} = this.props;

        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, (r) => dispatch(setSelectTimeRecord(r)));

        if (this.props.isInitial) {
            dispatch(getIntervals([], timeRange, limit))
            dispatch(getIntervalsCount([], timeRange, this.limit));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, intervals, firstLevel, timeRange, limit} = this.props;

        var needUpdate = (firstLevel != nextProps.firstLevel || timeRange != nextProps.timeRange);

        if (needUpdate) {
            var urls = nextProps.firstLevel.map(t => t.inner);
            dispatch(getIntervals(urls, nextProps.timeRange, limit));
            dispatch(getIntervalsCount(urls, nextProps.timeRange, limit));
        }

        if (nextProps.status.done) {
            if (nextProps.intervals != intervals || nextProps.timeRange != timeRange) {
                dispatch(getSelectTimeRecordReset());
                this.needChartUpdate = true;
            }
        }
    }

    componentDidUpdate() {
        const {intervals} = this.props;

        if (this.needChartUpdate) {
            this.chart.intervals(intervals);
            this.needChartUpdate = false;
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getIntervalsReset());
        dispatch(getSelectedTimeReset());
        dispatch(getSelectTimeRecordReset());

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
        return <Paper>
            <TimeRangeContainer/>
            <div className={this.className}/>
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

export default connect(selector)(TimeLineIntervalsContainer);