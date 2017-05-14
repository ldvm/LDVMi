import React, { Component } from 'react'

import { getFirstLevelInstants } from '../ducks/firstLevel'
import { getFirstLevelInstantsCount, getSecondLevelInstantsCount} from '../ducks/count'
import { getSecondLevelInstants } from '../ducks/secondLevel'

import BodyPadding from '../../../../components/BodyPadding'
import SecondLevelConnectionContainer from '../containers/SecondLevelConnectionContainer'
import FirstLevelConnectionContainer from '../containers/FirstLevelConnectionContainer'
import TimeLineInstantsContainer from '../containers/TimeLineInstantsContainer'
import CountSecondLevelContainer from '../containers/CountSecondLevelContainer'
import CountFirstLevelContainer from '../containers/CountFirstLevelContainer'
import CountZeroLevelContainer from '../containers/CountZeroLevelContainer'
import LimiterContainer from '../containers/LimiterContainer'
import InstantVisualizer from '../containers/InstantVisualizer'
import TimeRangeContainer from "../containers/TimeRangeContainer"

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
                        <td style={{"verticalAlign" : "top"}} >
                            <SecondLevelConnectionContainer
                                isInitial={true}
                                secondLevelLoader={getSecondLevelInstants}
                                secondLevelCount={getSecondLevelInstantsCount}
                            />
                            <CountSecondLevelContainer/>
                        </td>
                        <td style={{"verticalAlign" : "top"}} >
                            <FirstLevelConnectionContainer
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
export default InstantsToSecondLevel;