import React, {Component, PropTypes} from "react";
import {getFirstLevelIntervalsCount, getSecondLevelIntervalsCount} from "../ducks/count";
import {getSecondLevelIntervals} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelLoader from "../containers/SecondLevelLoader";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import TimeLineIntervals from "../components/TimeLineIntervals";
import IntervalsLoader from "../containers/IntervalsLoader";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import IntervalVisualizer from "../components/IntervalVisualizer";
import {PromiseStatus} from "../../../core/models";
import {getConfiguration, getConfigurationStatusSelector} from "../ducks/configuration";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import PromiseResult from "../../../core/components/PromiseResult";
import Toolbar from "../components/Toolbar";

class IntervalsToSecondLevel extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getConfiguration());
    }

    render() {
        const {status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading configuration..."/>
        }

        let configurations = new Map([
            ["SECOND LEVEL",
                <SecondLevelLoader
                    isInitial={true}
                    secondLevelLoader={getSecondLevelIntervals}
                    secondLevelCount={getSecondLevelIntervalsCount}
                />],
            ["FIRST LEVEL",
                <FirstLevelLoader
                    isInitial={false}
                    firstLevelLoader={getFirstLevelIntervals}
                    firstLevelCount={getFirstLevelIntervalsCount}
                />],
            ["TIME RANGE",
                <IntervalsLoader
                    isInitial={false}
                />],
            ["LIMIT",
                <LimiterContainer/>]

        ]);

        var hidden = true;
        if (this.props.route.configurable) hidden = false;

        return (
            <BodyPadding>
                <Toolbar configurations={configurations} hidden={hidden}/>
                <hr/>
                <TimeLineIntervals/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
const selector = createStructuredSelector({
    status: getConfigurationStatusSelector
});
export default connect(selector)(IntervalsToSecondLevel);