import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";
import FillInScreen from "../../../../components/FillInScreen";
import CoordinatesLoader from "../containers/CoordinatesLoader";
import GoogleMapsCircles from "../containers/GoogleMapsCircles";
import QuantifiedThingsLoader from "../containers/QuantifiedThingsLoader";
import PlacesLoader from "../containers/PlacesLoader";

class QuantifiedThings extends Component {
    render() {
        let configurations = new Map([
            ["THINGS",
                <QuantifiedThingsLoader isInitial={true}/>],
            ["PLACES",
                <PlacesLoader isInitial={false}/>],
            ["COORDINATES",
                <CoordinatesLoader isInitial={false}/>],
            ["LIMIT",
                <LimiterContainer/>]
        ]);

        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Visualization" children={configurations}/>
                <FillInScreen forceFill={true}>
                    <GoogleMapsCircles/>
                </FillInScreen>
            </BodyPadding>
        )
    }
}
export default QuantifiedThings;