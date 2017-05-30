import React, {Component} from "react";
import {getFirstLevelInstants} from "../ducks/firstLevel";
import {getFirstLevelInstantsCount, getSecondLevelInstantsCount} from "../ducks/count";
import {getSecondLevelInstants} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelLoader from "../containers/SecondLevelLoader";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import TimeLineInstantsContainer from "../containers/TimeLineInstantsContainer";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import InstantVisualizer from "../containers/InstantVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class InstantsToSecondLevel extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "SECOND LEVEL",
            <SecondLevelLoader
                isInitial={true}
                secondLevelLoader={getSecondLevelInstants}
                secondLevelCount={getSecondLevelInstantsCount}
            />);
        configurations.set("FIRST LEVEL",
            <FirstLevelLoader
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