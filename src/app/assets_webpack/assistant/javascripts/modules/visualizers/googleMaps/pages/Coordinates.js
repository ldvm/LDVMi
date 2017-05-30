import React, {Component} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import ConfigurationToolbar from "../../../common/ConfigurationToolbar";
import GoogleMapsMarkers from "../containers/GoogleMapsMarkers";
import FillInScreen from "../../../../components/FillInScreen";
import CoordinatesLoader from "../containers/CoordinatesLoader";
import PlacesLoader from "../containers/PlacesLoader";
import ThingsWithPlacesLoader from "../containers/ThingsWithPlacesLoader";

class Coordinates extends Component {
    render() {
        let configurations = new Map();
        configurations.set(
            "THINGS WITH PLACES",
            <ThingsWithPlacesLoader isInitial={true}/>
        );
        configurations.set(
            "PLACES",
            <PlacesLoader isInitial={false}/>
        );
        configurations.set(
            "COORDINATES",
            <CoordinatesLoader isInitial={false}/>
        );
        configurations.set(
            "LIMIT",
            <LimiterContainer isInitial={false}/>
        );

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