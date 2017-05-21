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

class IntervalsToSecondLevel extends Component {
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
                                secondLevelLoader={getSecondLevelIntervals}
                                secondLevelCount={getSecondLevelIntervalsCount}
                            />
                        </td>
                        <td style={{"verticalAlign": "top", "width": "50%"}}>
                            <FirstLevelConnectionContainer
                                firstLevelLoader={getFirstLevelIntervals}
                                firstLevelCount={getFirstLevelIntervalsCount}
                            />
                        </td>
                    </tr>
                    </tbody>
                </table>

                <hr/>
                <TimeLineIntervalsContainer/>

                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default IntervalsToSecondLevel;