import React, {Component} from "react";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import {getFirstLevelIntervalsCount, getSecondLevelIntervalsCount} from "../ducks/count";
import {getSecondLevelIntervals} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelLoader from "../containers/SecondLevelLoader";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class IntervalsToSecondLevel extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "SECOND LEVEL",
            <SecondLevelLoader
                isInitial={true}
                secondLevelLoader={getSecondLevelIntervals}
                secondLevelCount={getSecondLevelIntervalsCount}
            />);
        configurations.set("FIRST LEVEL",
            <FirstLevelLoader
                firstLevelLoader={getFirstLevelIntervals}
                firstLevelCount={getFirstLevelIntervalsCount}
            />
        );
        configurations.set(
            "LIMIT",
            <LimiterContainer/>
        );

        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Connections" children={configurations}/>
                <hr/>
                <TimeLineIntervalsContainer/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default IntervalsToSecondLevel;