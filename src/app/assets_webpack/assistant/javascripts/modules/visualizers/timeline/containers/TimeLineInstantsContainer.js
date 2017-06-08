import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {PromiseStatus} from "../../../core/models";
import {TimeRange} from "../models";
import {getInstants, getInstantsReset, instantsSelector, instantsStatusSelector} from "../ducks/instants";
import {getInstantsCount} from "../ducks/count";
import {limitSelector} from "../../../app/ducks/limit";
import {getSelectedTimeReset, timeRangeSelector} from "../ducks/timeRange";
import {firstLevelSelector} from "../ducks/firstLevel";
import {setSelectTimeRecord, setSelectTimeRecordReset} from "../ducks/selectedTimeRecord";
import PromiseResult from "../../../core/components/PromiseResult";
import TimeLine from "../misc/TimeLine";
import CenteredMessage from "../../../../components/CenteredMessage";
import CountZeroLevelContainer from "../components/CountTimeRecord";
import TimeRangeContainer from "./TimeRangeContainer";
import {Paper} from "material-ui";

class TimeLineInstantsContainer extends Component {
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
        const {dispatch, timeRange, limit} = this.props;

        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, (r) => dispatch(setSelectTimeRecord(r)));

        if (this.props.isInitial) {
            dispatch(getInstants([], timeRange, limit));
            dispatch(getInstantsCount([], timeRange));
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevel, timeRange, limit} = this.props;

        var needUpdate = (firstLevel != nextProps.firstLevel || timeRange != nextProps.timeRange);

        if (needUpdate) {
            var urls = nextProps.firstLevel.map(t => t.inner);
            dispatch(getInstants(urls, nextProps.timeRange, limit));
            dispatch(getInstantsCount(urls, nextProps.timeRange));
        }

        if (nextProps.status.done && nextProps.instants != this.props.instants) {
            dispatch(setSelectTimeRecordReset());
            this.needChartUpdate = true;
        }
    }

    componentDidUpdate() {
        const {instants} = this.props;
        if (this.needChartUpdate) {
            this.chart.instants(instants);
            this.needChartUpdate = false;
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getInstantsReset());
        dispatch(getSelectedTimeReset());
        dispatch(setSelectTimeRecordReset());

        this.chart.destroy();
    }

    render() {
        const {status, instants} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading instants..."/>
        }

        if (instants.length == 0) {
            return <Paper>
                <TimeRangeContainer/>
                <CenteredMessage>No instants loaded.</CenteredMessage>
            </Paper>
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
    instants: instantsSelector,
    status: instantsStatusSelector,
    firstLevel: firstLevelSelector,
    timeRange: timeRangeSelector,
    limit: limitSelector
});

export default connect(selector)(TimeLineInstantsContainer);