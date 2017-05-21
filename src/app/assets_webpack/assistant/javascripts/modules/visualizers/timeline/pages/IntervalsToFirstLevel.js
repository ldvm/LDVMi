import React, {Component} from "react";

import {getFirstLevelIntervals} from "../ducks/firstLevel";
import {getFirstLevelIntervalsCount} from "../ducks/count";

import BodyPadding from "../../../../components/BodyPadding";

import FirstLevelConnectionContainer from "../containers/FirstLevelConnectionContainer";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";

class IntervalsToFirstLevel extends Component {
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
export default IntervalsToFirstLevel;