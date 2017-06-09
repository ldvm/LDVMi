import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/components/ConfigurationToolbar";
import TimeLineIntervals from "../components/TimeLineIntervals";
import IntervalsLoader from "../containers/IntervalsLoader";
import IntervalVisualizer from "../components/IntervalVisualizer";

class Intervals extends Component {
    render() {
        let configurations = new Map([
            ["TIME RANGE",
                <IntervalsLoader
                    isInitial={true}
                />],
            ["LIMIT",
                <LimiterContainer/>]

        ]);
        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Connections" children={configurations}/>
                <hr/>
                <TimeLineIntervals/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
export default Intervals;