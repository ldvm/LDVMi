import React, { Component, PropTypes } from 'react'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'

import { getFirstLevelIntervals } from '../ducks/firstLevel'
import { getFirstLevelIntervalsCount } from '../ducks/count'

import { getSecondLevelIntervals } from '../ducks/secondLevel'

import BodyPadding from '../../../../components/BodyPadding'
import SecondLevelConnectionContainer from '../containers/SecondLevelConnectionContainer'
import FirstLevelConnectionContainer from '../containers/FirstLevelConnectionContainer'
import TimeLineIntervalsContainer from '../containers/TimeLineIntervalsContainer'
import LimiterContainer from '../containers/LimiterContainer'

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
                    </tr>
                    <tr>
                        <td style={{"vertical-align" : "top"}}><SecondLevelConnectionContainer secondLevelLoader={getSecondLevelIntervals}/></td>
                        <td  style={{"vertical-align" : "top"}}> <FirstLevelConnectionContainer firstLevelLoader={getFirstLevelIntervals} firstLevelCount={getFirstLevelIntervalsCount}/></td>
                    </tr>
                    </tbody>
                </table>
                <hr/>
                <TimeLineIntervalsContainer/>
            </BodyPadding>
        )
    }
}
export default Configurator;