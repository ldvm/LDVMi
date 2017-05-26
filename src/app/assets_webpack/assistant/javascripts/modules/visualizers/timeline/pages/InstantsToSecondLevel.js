import React, {Component} from "react";
import {getFirstLevelInstants} from "../ducks/firstLevel";
import {getFirstLevelInstantsCount, getSecondLevelInstantsCount} from "../ducks/count";
import {getSecondLevelInstants} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelConnectionContainer from "../containers/SecondLevelConnectionContainer";
import FirstLevelConnectionContainer from "../containers/FirstLevelConnectionContainer";
import TimeLineInstantsContainer from "../containers/TimeLineInstantsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import InstantVisualizer from "../containers/InstantVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class InstantsToSecondLevel extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "SECOND LEVEL",
            <SecondLevelConnectionContainer
                isInitial={true}
                secondLevelLoader={getSecondLevelInstants}
                secondLevelCount={getSecondLevelInstantsCount}
            />);
        configurations.set("FIRST LEVEL",
            <FirstLevelConnectionContainer
                firstLevelLoader={getFirstLevelInstants}
                firstLevelCount={getFirstLevelInstantsCount}
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
                <TimeLineInstantsContainer/>
                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default InstantsToSecondLevel;