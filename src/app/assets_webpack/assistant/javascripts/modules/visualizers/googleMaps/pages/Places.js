import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";
import FillInScreen from "../../../../components/FillInScreen";
import CoordinatesLoader from "../containers/CoordinatesLoader";
import GoogleMapsMarkers from "../containers/GoogleMapsMarkers";
import PlacesLoader from "../containers/PlacesLoader";

class Coordinates extends Component {
    render() {
        let configurations = new Map([
            ["PLACES",
                <PlacesLoader isInitial={true}/>],
            ["COORDINATES",
                <CoordinatesLoader isInitial={false}/>],
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