import React, { Component } from 'react'

import BodyPadding from '../../../../components/BodyPadding'
import TimeLineInstantsContainer from '../containers/TimeLineInstantsContainer'
import CountZeroLevelContainer from '../containers/CountZeroLevelContainer'
import InstantVisualizer from '../containers/InstantVisualizer'
import LimiterContainer from '../containers/LimiterContainer'
import TimeRangeContainer from "../containers/TimeRangeContainer"

class Instants extends Component {
    render() {
        return (
            <BodyPadding>
                <LimiterContainer/>
                <TimeRangeContainer/>
                <TimeLineInstantsContainer isInitial={true}/>
                <CountZeroLevelContainer/>

                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default Instants;