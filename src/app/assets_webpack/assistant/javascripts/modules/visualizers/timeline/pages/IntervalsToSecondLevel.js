import React, { Component } from 'react'

import { getFirstLevelIntervals } from '../ducks/firstLevel'
import { getFirstLevelIntervalsCount, getSecondLevelIntervalsCount} from '../ducks/count'
import { getSecondLevelIntervals } from '../ducks/secondLevel'

import BodyPadding from '../../../../components/BodyPadding'

import SecondLevelConnectionContainer from '../containers/SecondLevelConnectionContainer'
import FirstLevelConnectionContainer from '../containers/FirstLevelConnectionContainer'
import TimeLineIntervalsContainer from '../containers/TimeLineIntervalsContainer'
import CountSecondLevelContainer from '../containers/CountSecondLevelContainer'
import CountFirstLevelContainer from '../containers/CountFirstLevelContainer'
import CountZeroLevelContainer from '../containers/CountZeroLevelContainer'
import LimiterContainer from '../containers/LimiterContainer'
import IntervalVisualizer from '../containers/IntervalVisualizer'
import TimeRangeContainer from "../containers/TimeRangeContainer";

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
                        <td style={{"verticalAlign" : "top"}} >
                            <SecondLevelConnectionContainer
                                isInitial={true}
                                secondLevelLoader={getSecondLevelIntervals}
                                secondLevelCount={getSecondLevelIntervalsCount}
                            />
                            <CountSecondLevelContainer/>
                        </td>
                        <td style={{"verticalAlign" : "top", "textAlign":"right"}} >
                            <FirstLevelConnectionContainer
                                firstLevelLoader={getFirstLevelIntervals}
                                firstLevelCount={getFirstLevelIntervalsCount}
                            />
                            <CountFirstLevelContainer/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <hr/>
                <TimeRangeContainer/>
                <TimeLineIntervalsContainer/>
                <CountZeroLevelContainer/>

                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default IntervalsToSecondLevel;