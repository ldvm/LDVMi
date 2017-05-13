import React, { Component } from 'react'

import { getFirstLevelInstants } from '../ducks/firstLevel'
import { getFirstLevelInstantsCount } from '../ducks/count'

import BodyPadding from '../../../../components/BodyPadding'
import FirstLevelConnectionContainer from '../containers/FirstLevelConnectionContainer'
import TimeLineInstantsContainer from '../containers/TimeLineInstantsContainer'
import CountFirstLevelContainer from '../containers/CountFirstLevelContainer'
import CountZeroLevelContainer from '../containers/CountZeroLevelContainer'
import LimiterContainer from '../containers/LimiterContainer'
import InstantVisualizer from '../containers/InstantVisualizer'
import TimeRangeContainer from "../containers/TimeRangeContainer"

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
                        <td style={{"verticalAlign" : "top", "float":"right"}} >
                            <FirstLevelConnectionContainer
                                isInitial={true}
                                firstLevelLoader={getFirstLevelInstants}
                                firstLevelCount={getFirstLevelInstantsCount}
                            />
                            <CountFirstLevelContainer/>
                        </td>
                    </tr>
                    </tbody>
                </table>

                <hr/>
                <TimeRangeContainer/>
                <TimeLineInstantsContainer/>
                <CountZeroLevelContainer/>

                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default InstantsToFirstLevel;