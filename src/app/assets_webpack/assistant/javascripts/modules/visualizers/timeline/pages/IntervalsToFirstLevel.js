import React, {Component} from "react";
import {getFirstLevelIntervalsCount} from "../ducks/count";
import BodyPadding from "../../../../components/BodyPadding";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";
import TimeLineIntervals from "../containers/TimeLineIntervals";
import IntervalsLoader from "../containers/IntervalsLoader";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import IntervalVisualizer from "../components/IntervalVisualizer";

class IntervalsToFirstLevel extends Component {
    render() {
        let configurations = new Map([
            ["FIRST LEVEL",
                <FirstLevelLoader
                    isInitial={true}
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
        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Connections" children={configurations}/>
                <hr/>
                <TimeLineIntervals/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default IntervalsToFirstLevel;