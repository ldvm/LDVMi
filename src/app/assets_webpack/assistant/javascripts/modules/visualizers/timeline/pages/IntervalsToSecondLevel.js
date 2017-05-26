import React, {Component} from "react";
import {getFirstLevelIntervals} from "../ducks/firstLevel";
import {getFirstLevelIntervalsCount, getSecondLevelIntervalsCount} from "../ducks/count";
import {getSecondLevelIntervals} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelConnectionContainer from "../containers/SecondLevelConnectionContainer";
import FirstLevelConnectionContainer from "../containers/FirstLevelConnectionContainer";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class IntervalsToSecondLevel extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "SECOND LEVEL",
            <SecondLevelConnectionContainer
                isInitial={true}
                secondLevelLoader={getSecondLevelIntervals}
                secondLevelCount={getSecondLevelIntervalsCount}
            />);
        configurations.set("FIRST LEVEL",
            <FirstLevelConnectionContainer
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