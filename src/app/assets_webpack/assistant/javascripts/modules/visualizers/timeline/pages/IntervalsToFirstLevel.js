import React, {Component} from "react";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import {getFirstLevelIntervalsCount} from "../ducks/count";
import BodyPadding from "../../../../components/BodyPadding";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class IntervalsToFirstLevel extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "FIRST LEVEL",
            <FirstLevelLoader
                isInitial={true}
                firstLevelLoader={getFirstLevelIntervals}
                firstLevelCount={getFirstLevelIntervalsCount}
            />);
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
export default IntervalsToFirstLevel;