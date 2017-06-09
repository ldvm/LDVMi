import React, {Component} from "react";
import {getFirstLevelIntervalsCount, getSecondLevelIntervalsCount} from "../ducks/count";
import {getSecondLevelIntervals} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelLoader from "../containers/SecondLevelLoader";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/components/ConfigurationToolbar";
import TimeLineIntervals from "../components/TimeLineIntervals";
import IntervalsLoader from "../containers/IntervalsLoader";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import IntervalVisualizer from "../components/IntervalVisualizer";

class InstantsToSecondLevel extends Component {
    render() {
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
export default InstantsToSecondLevel;