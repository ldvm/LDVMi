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

class InstantsToSecondLevel extends Component {
    render() {
        return (
            <BodyPadding>
                <table>
                    <tbody>
                    <tr>
                        <td><LimiterContainer/></td>
                    </tr>
                    <tr>
                        <td style={{"verticalAlign": "top", "width": "50%"}}>
                            <SecondLevelConnectionContainer
                                isInitial={true}
                                secondLevelLoader={getSecondLevelInstants}
                                secondLevelCount={getSecondLevelInstantsCount}
                            />
                        </td>
                        <td style={{"verticalAlign": "top", "width": "50%"}}>
                            <FirstLevelConnectionContainer
                                firstLevelLoader={getFirstLevelInstants}
                                firstLevelCount={getFirstLevelInstantsCount}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <hr/>
                <TimeLineInstantsContainer/>

                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default InstantsToSecondLevel;