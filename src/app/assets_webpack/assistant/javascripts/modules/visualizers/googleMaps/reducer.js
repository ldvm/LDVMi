import {combineReducers} from "redux";
import markers from "./ducks/markers";
import filters from "./ducks/filters";
import mapState from "./ducks/mapState";
import toggledMarkers from "./ducks/toggledMarkers";
import publishSettings from "./ducks/publishSettings";
import coordinates from "./ducks/coordinates";
import places from "./ducks/places";
import thingsWithPlaces from "./ducks/thingsWithPlaces";
import quantifiers from "./ducks/quantifiers";
import dirty from "./ducks/dirty";
import selectedPlaceConnections from "./ducks/selectedPlaceConnections";
import selectedPlaceTypes from "./ducks/selectedPlaceTypes";
import selectedThings from "./ducks/selectedThings";
import count from "./ducks/counts"

const rootReducer = combineReducers({
    filters,
    markers,
    mapState,
    toggledMarkers,
    publishSettings,
    coordinates,
    places,
    selectedPlaceConnections,
    selectedPlaceTypes,
    thingsWithPlaces,
    selectedThings,
    quantifiers,
    count,
    dirty
});

export default rootReducer;
