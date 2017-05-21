import React, {Component} from "react";

import BodyPadding from "../../../../components/BodyPadding";
import TimeLineInstantsContainer from "../containers/TimeLineInstantsContainer";
import InstantVisualizer from "../containers/InstantVisualizer";
import LimiterContainer from "../containers/LimiterContainer";

class Instants extends Component {
    render() {
        return (
            <BodyPadding>
                <LimiterContainer/>
                <TimeLineInstantsContainer isInitial={true}/>

                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
export default Instants;