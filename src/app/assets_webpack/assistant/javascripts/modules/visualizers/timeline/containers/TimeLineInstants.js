import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {PromiseStatus} from "../../../core/models";
import {instantsSelector, instantsStatusSelector} from "../ducks/instants";
import {firstLevelSelector, firstLevelStatusSelector} from "../ducks/firstLevel";
import {setSelectTimeRecord} from "../ducks/selectedTimeRecord";
import TimeLine from "../misc/TimeLine";
import CenteredMessage from "../../../../components/CenteredMessage";
import {secondLevelSelector, secondLevelStatusSelector} from "../ducks/secondLevel";
import {getLeveledInstants} from "../misc/TimeLineUtils";
import {Paper} from "material-ui";
import PromiseResult from "../../../core/components/PromiseResult";

class TimeLineInstants extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Levels
        instants: PropTypes.array.isRequired,
        firstLevel: PropTypes.array.isRequired,
        secondLevel: PropTypes.array.isRequired,

        // Loading status
        instantsStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
        firstLevelStatus: PropTypes.instanceOf(PromiseStatus).isRequired,
        secondLevelStatus: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;

        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, (r) => dispatch(setSelectTimeRecord(r)));
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.instants != nextProps.instants) {
            this.needChartUpdate = true;
        }
    }

    componentDidUpdate() {
        if (this.needChartUpdate) {

            var MAX_GRAPH_LEVELS = 8;
            var leveled = getLeveledInstants(this.props.instants, MAX_GRAPH_LEVELS);

            this.chart.destroy();
            this.chart.instants(leveled);

            this.needChartUpdate = false;
        }
    }

    componentWillUnmount() {
        this.chart.destroy();
    }

    render() {
        const {instants, instantsStatus, firstLevelStatus, secondLevelStatus} = this.props;

        if (instantsStatus.isLoading) {
            return <PromiseResult status={instantsStatus} error={instantsStatus.error}
                                  loadingMessage="Loading instants..."/>
        }

        if (firstLevelStatus.isLoading) {
            return <PromiseResult status={firstLevelStatus} error={firstLevelStatus.error}
                                  loadingMessage="Loading connected things..."/>
        }

        if (secondLevelStatus.isLoading) {
            return <PromiseResult status={secondLevelStatus} error={secondLevelStatus.error}
                                  loadingMessage="Loading connected things (II)..."/>
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

const selector = createStructuredSelector({
    instants: instantsSelector,
    firstLevel: firstLevelSelector,
    secondLevel: secondLevelSelector,

    instantsStatus: instantsStatusSelector,
    firstLevelStatus: firstLevelStatusSelector,
    secondLevelStatus: secondLevelStatusSelector
});

export default connect(selector)(TimeLineInstants);