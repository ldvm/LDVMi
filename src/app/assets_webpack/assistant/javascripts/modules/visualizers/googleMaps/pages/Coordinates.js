import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/components/ConfigurationToolbar";
import FillInScreen from "../../../../components/FillInScreen";
import CoordinatesLoader from "../containers/CoordinatesLoader";
import GoogleMapsMarkers from "../containers/GoogleMapsMarkers";

class Coordinates extends Component {
    render() {
        let configurations = new Map([
            ["COORDINATES",
                <CoordinatesLoader isInitial={true}/>],
            ["LIMIT",
                <LimiterContainer/>]
        ]);

        return (
            <BodyPadding>
                <ConfigurationToolbar label="Configure Visualization" children={configurations}/>
                <FillInScreen forceFill={true}>
                    <GoogleMapsMarkers/>
                </FillInScreen>
            </BodyPadding>
        )
    }
}
export default Coordinates;