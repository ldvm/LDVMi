import React, { Component, PropTypes } from 'react'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'
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
import LanguageSwitch from "../../../app/containers/LanguageSwitch";

class Configurator extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(Application).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired
    };

    render() {

        return (
            <BodyPadding>
                <table>
                    <tbody>
                    <tr>
                        <td><LimiterContainer/></td>
                        <td><LanguageSwitch/></td>
                    </tr>
                    <tr>
                        <td style={{"vertical-align" : "top"}} >
                            <SecondLevelConnectionContainer
                                isInitial={true}
                                secondLevelLoader={getSecondLevelIntervals}
                                secondLevelCount={getSecondLevelIntervalsCount}
                            />
                            <CountSecondLevelContainer/>
                        </td>
                        <td style={{"vertical-align" : "top"}} >
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
                <TimeLineIntervalsContainer/>
                <CountZeroLevelContainer/>
            </BodyPadding>
        )
    }
}
export default Configurator;