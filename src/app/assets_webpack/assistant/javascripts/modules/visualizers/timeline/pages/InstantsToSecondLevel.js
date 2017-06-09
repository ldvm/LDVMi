import React, {Component} from "react";
import {getFirstLevelInstants} from "../ducks/firstLevel";
import {getFirstLevelInstantsCount, getSecondLevelInstantsCount} from "../ducks/count";
import {getSecondLevelInstants} from "../ducks/secondLevel";
import BodyPadding from "../../../../components/BodyPadding";
import SecondLevelLoader from "../containers/SecondLevelLoader";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import TimeLineInstants from "../containers/TimeLineInstants";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import InstantVisualizer from "../components/InstantVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";
import InstantsLoader from "../containers/InstantsLoader";

class InstantsToSecondLevel extends Component {
    render() {
        let configurations = new Map([
            ["SECOND LEVEL",
                <SecondLevelLoader
                    isInitial={true}
                    secondLevelLoader={getSecondLevelInstants}
                    secondLevelCount={getSecondLevelInstantsCount}
                />],
            ["FIRST LEVEL",
                <FirstLevelLoader
                    isInitial={false}
                    firstLevelLoader={getFirstLevelInstants}
                    firstLevelCount={getFirstLevelInstantsCount}
                />],
            ["TIME RANGE",
                <InstantsLoader
                    isInitial={false}
                />],
            ["LIMIT",
                <LimiterContainer/>]

        ]);
        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Connections" children={configurations}/>
                <hr/>
                <TimeLineInstants/>
                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default InstantsToSecondLevel;