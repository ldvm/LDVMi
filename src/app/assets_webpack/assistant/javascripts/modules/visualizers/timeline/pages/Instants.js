import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import TimeLineInstants from "../containers/TimeLineInstants";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import InstantVisualizer from "../components/InstantVisualizer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";
import InstantsLoader from "../containers/InstantsLoader";

class Instants extends Component {
    render() {
        let configurations = new Map([
            ["TIME RANGE",
                <InstantsLoader
                    isInitial={true}
                />],
            ["LIMIT",
                <LimiterContainer/>]

        ]);
        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Connections" children={configurations}/>
                <hr/>
                <TimeLineInstants/>
                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default Instants;