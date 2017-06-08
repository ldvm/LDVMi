import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import TimeLineInstantsContainer from "../containers/TimeLineInstantsContainer";
import InstantVisualizer from "../components/InstantVisualizer";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";

class Instants extends Component {
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
                <TimeLineInstantsContainer isInitial={true}/>
                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default Instants;