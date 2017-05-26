import React, {Component} from "react";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import {getFirstLevelIntervalsCount} from "../ducks/count";
import BodyPadding from "../../../../components/BodyPadding";
import FirstLevelConnectionContainer from "../containers/FirstLevelConnectionContainer";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class IntervalsToFirstLevel extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "FIRST LEVEL",
            <FirstLevelConnectionContainer
                isInitial={true}
                secondLevelLoader={getFirstLevelIntervals}
                secondLevelCount={getFirstLevelIntervalsCount}
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