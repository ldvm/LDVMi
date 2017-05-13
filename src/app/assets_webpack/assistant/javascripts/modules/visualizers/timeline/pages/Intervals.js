import React, { Component } from 'react'

import BodyPadding from '../../../../components/BodyPadding'
import TimeLineIntervalsContainer from '../containers/TimeLineIntervalsContainer'
import CountZeroLevelContainer from '../containers/CountZeroLevelContainer'
import LimiterContainer from '../containers/LimiterContainer'
import IntervalVisualizer from '../containers/IntervalVisualizer'
import TimeRangeContainer from "../containers/TimeRangeContainer";

class Intervals extends Component {
    render() {
        return (
            <BodyPadding>
                <LimiterContainer/>
                <TimeRangeContainer/>
                <TimeLineIntervalsContainer isInitial={true}/>
                <CountZeroLevelContainer/>

                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default Intervals;