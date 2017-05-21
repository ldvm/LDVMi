import React, {Component} from "react";

import BodyPadding from "../../../../components/BodyPadding";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";

class Intervals extends Component {
    render() {
        return (
            <BodyPadding>
                <LimiterContainer/>
                <TimeLineIntervalsContainer isInitial={true}/>

                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default Intervals;