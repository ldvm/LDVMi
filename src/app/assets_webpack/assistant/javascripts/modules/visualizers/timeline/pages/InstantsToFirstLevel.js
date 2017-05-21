import React, {Component} from "react";

import {getFirstLevelInstants} from "../ducks/firstLevel";
import {getFirstLevelInstantsCount} from "../ducks/count";

import BodyPadding from "../../../../components/BodyPadding";
import FirstLevelConnectionContainer from "../containers/FirstLevelConnectionContainer";
import TimeLineInstantsContainer from "../containers/TimeLineInstantsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import InstantVisualizer from "../containers/InstantVisualizer";

class InstantsToFirstLevel extends Component {
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
                            <FirstLevelConnectionContainer
                                isInitial={true}
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
export default InstantsToFirstLevel;