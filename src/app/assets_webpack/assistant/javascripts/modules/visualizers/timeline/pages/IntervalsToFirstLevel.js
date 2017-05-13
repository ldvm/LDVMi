import React, { Component } from 'react'

import { getFirstLevelIntervals } from '../ducks/firstLevel'
import { getFirstLevelIntervalsCount } from '../ducks/count'

import BodyPadding from '../../../../components/BodyPadding'

import FirstLevelConnectionContainer from '../containers/FirstLevelConnectionContainer'
import TimeLineIntervalsContainer from '../containers/TimeLineIntervalsContainer'
import CountFirstLevelContainer from '../containers/CountFirstLevelContainer'
import CountZeroLevelContainer from '../containers/CountZeroLevelContainer'
import LimiterContainer from '../containers/LimiterContainer'
import IntervalVisualizer from '../containers/IntervalVisualizer'
import TimeRangeContainer from "../containers/TimeRangeContainer";

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
                        <td style={{"verticalAlign" : "top", "textAlign":"right"}} >
                            <FirstLevelConnectionContainer
                                isInitial={true}
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
export default IntervalsToFirstLevel;