import {combineReducers} from "redux";
import markers from "./ducks/markers";
import filters from "./ducks/filters";
import mapState from "./ducks/mapState";
import toggledMarkers from "./ducks/toggledMarkers";
import publishSettings from "./ducks/publishSettings";
import coordinates from "./ducks/coordinates";
import places from "./ducks/places";
import quantifiedThings from "./ducks/quantifiedThings";
import quantifiedPlaces from "./ducks/quantifiedPlaces";
import selectedPlaceConnections from "./ducks/selectedPlaceConnections";
import selectedPlaceTypes from "./ducks/selectedPlaceTypes";
import selectedQuantifiedThings from "./ducks/selectedQuantifiedThings";
import selectedValueConnections from "./ducks/selectedValueConnections";
import count from "./ducks/counts";
import dirty from "./ducks/dirty";

const rootReducer = combineReducers({
    filters,
    markers,
    mapState,
    toggledMarkers,
    publishSettings,
    coordinates,
    places,
    quantifiedThings,
    quantifiedPlaces,
    selectedQuantifiedThings,
    selectedPlaceConnections,
    selectedValueConnections,
    selectedPlaceTypes,
    count,
    dirty
});

export default rootReducer;
