import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {PromiseStatus} from "../../../core/models";
import {firstLevelSelector, firstLevelStatusSelector} from "../ducks/firstLevel";
import {setSelectTimeRecord} from "../ducks/selectedTimeRecord";
import TimeLine from "../misc/TimeLine";
import CenteredMessage from "../../../../components/CenteredMessage";
import {secondLevelSelector, secondLevelStatusSelector} from "../ducks/secondLevel";
import {getLeveledIntervals} from "../misc/TimeLineUtils";
import {Paper} from "material-ui";
import PromiseResult from "../../../core/components/PromiseResult";
import {intervalsSelector, intervalsStatusSelector} from "../ducks/intervals";

class TimeLineInstants extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Levels
        intervals: PropTypes.array.isRequired,
        firstLevel: PropTypes.array.isRequired,
        secondLevel: PropTypes.array.isRequired,

        // Loading status
        intervalsStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
        firstLevelStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
        secondLevelStatus: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;

        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, (r) => dispatch(setSelectTimeRecord(r)));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.intervals != nextProps.intervals) {
            this.needChartUpdate = true;
        }
    }

    componentDidUpdate() {
        if (this.needChartUpdate) {

            var MAX_GRAPH_LEVELS = 8;
            var leveled = getLeveledIntervals(this.props.intervals, MAX_GRAPH_LEVELS);

            this.chart.destroy();
            this.chart.intervals(leveled);

            this.needChartUpdate = false;
        }
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    render() {
        const {intervals, intervalsStatus, firstLevelStatus, secondLevelStatus} = this.props;

        if (intervalsStatus.isLoading) {
            return <PromiseResult status={intervalsStatus} error={intervalsStatus.error}
                                  loadingMessage="Loading intervals..."/>
        }

        if (firstLevelStatus.isLoading) {
            return <PromiseResult status={firstLevelStatus} error={firstLevelStatus.error}
                                  loadingMessage="Loading connected things..."/>
        }

        if (secondLevelStatus.isLoading) {
            return <PromiseResult status={secondLevelStatus} error={secondLevelStatus.error}
                                  loadingMessage="Loading connected things (II)..."/>
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

const selector = createStructuredSelector({
    intervals: intervalsSelector,
    firstLevel: firstLevelSelector,
    secondLevel: secondLevelSelector,

    intervalsStatus: intervalsStatusSelector,
    firstLevelStatus: firstLevelStatusSelector,
    secondLevelStatus: secondLevelStatusSelector
});

export default connect(selector)(TimeLineInstants);