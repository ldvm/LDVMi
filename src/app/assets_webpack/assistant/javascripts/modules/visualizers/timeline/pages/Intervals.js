import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../containers/LimiterContainer";
import IntervalVisualizer from "../containers/IntervalVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class Intervals extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "LIMIT",
            <LimiterContainer/>
        );

        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Connections" children={configurations}/>
                <hr/>
                <TimeLineIntervalsContainer/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default Intervals;