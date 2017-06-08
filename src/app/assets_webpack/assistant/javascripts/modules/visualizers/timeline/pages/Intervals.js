import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import TimeLineIntervalsContainer from "../containers/TimeLineIntervalsContainer";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import IntervalVisualizer from "../components/IntervalVisualizer";
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
                <TimeLineIntervalsContainer isInitial={true}/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default Intervals;