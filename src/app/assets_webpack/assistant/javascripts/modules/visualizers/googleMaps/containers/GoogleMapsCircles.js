import React, {Component, PropTypes} from "react";
import {connect, Provider} from "react-redux";
import {Set as ImmutableSet} from "immutable";
import {Circle, InfoWindow} from "react-google-maps";
import GoogleMap from "../../../../components/GoogleMap";
import {mapStateSelector, updateMapState} from "../ducks/mapState";
import {toggledMarkersSelector, toggleMarker} from "../ducks/toggledMarkers";
import {coordinatesSelector} from "../ducks/coordinates";
import MapMarker from "../components/MapMarkerInfoWindow";
import {MapState} from "../models";
import {createStructuredSelector} from "reselect";
import {placesSelector} from "../ducks/places";
import {quantifiedThingsSelector} from "../ducks/quantifiedThings";
import {quantifiedPlacesSelector} from "../ducks/quantifiedPlaces";

class GoogleMapsMarkers extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        coordinates: PropTypes.instanceOf(Array).isRequired,
        places: PropTypes.array.isRequired,
        quantifiedThings: PropTypes.array.isRequired,
        quantifiedPlaces: PropTypes.array.isRequired,

        mapState: PropTypes.instanceOf(MapState).isRequired,
        toggledMarkers: PropTypes.instanceOf(ImmutableSet).isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    // === MARKERS ===
    infoWindow(coors) {
        const {toggledMarkers, dispatch} = this.props;

        const position = {
            lat: parseFloat(coors.latitude.toFixed(5)),
            lng: parseFloat(coors.longitude.toFixed(5))
        };

        if (toggledMarkers.contains(coors.url)) {
            return (
                <InfoWindow
                    key={coors.url}
                    onCloseclick={() => dispatch(toggleMarker(coors.url))}
                    position={position}
                >
                    <Provider store={this.context.store}>
                        <MapMarker url={coors.url}/>
                    </Provider>
                </InfoWindow>
            );
        }

        return "";
    }

    // === CIRCLES ===
    getQuantifiedThingValue(url) {
        const {places, quantifiedThings} = this.props;

        for (const place of places) {
            if (place.coordinates == url) {
                for (const thing of quantifiedThings) {
                    if (thing.place == place.url) {
                        return thing.value;
                    }
                }
            }
        }
        return 0;
    }

    getQuantifiedPlaceValue(url) {
        const {quantifiedPlaces} = this.props;

        for (const place of quantifiedPlaces) {
            if (place.coordinates == url) {
                return place.value;
            }
        }
        return 0;
    }

    getMaxOfAllValues() {
        const {quantifiedPlaces, quantifiedThings} = this.props;

        var qpvMax = Math.max.apply(null, quantifiedPlaces.map(p => p.value));
        var qtvMax = Math.max.apply(null, quantifiedThings.map(t => t.value));

        return (qtvMax > qpvMax) ? qtvMax : qpvMax;
    }

    circle(coordinates, maxValue) {
        const {dispatch} = this.props;
        const MAX_RADIUS = 10 * 1000; // This is in meters => 10 km radius is ~ok
        var value = 0;

        // From quantified things
        var qtv = this.getQuantifiedThingValue(coordinates.url);
        if (qtv > 0) value = qtv;

        // From quantified places
        var qpv = this.getQuantifiedPlaceValue(coordinates.url);
        if (qpv > 0) value = qpv;

        // Map to (0,200)
        const radius = (value / maxValue) * MAX_RADIUS;

        // Render the circle.
        const position = {
            lat: parseFloat(coordinates.latitude.toFixed(5)),
            lng: parseFloat(coordinates.longitude.toFixed(5))
        };
        return (
            <Circle
                key={coordinates.url}
                center={position}
                radius={radius}
                strokeColor={"#D35400"}
                strokeOpacity={0.8}
                strokeWeight={2}
                fillColor={"#D35400"}
                fillOpacity={0.4}
                onClick={() => dispatch(toggleMarker(coordinates.url))}
            />
        );
    }

    render() {
        const {dispatch, coordinates, mapState} = this.props;

        var maxValue = this.getMaxOfAllValues();
        return (
            <GoogleMap
                onZoomChanged={zoomLevel => dispatch(updateMapState({zoomLevel}))}
                onCenterChanged={center => dispatch(updateMapState({center}))}
                defaultZoom={mapState.zoomLevel}
                defaultCenter={mapState.center.toJS()}
            >
                {coordinates.map(c => this.infoWindow(c))}
                {coordinates.map(c => this.circle(c, maxValue))}
            </GoogleMap>
        );
    };
}

const selector = createStructuredSelector({
    coordinates: coordinatesSelector,
    places: placesSelector,
    quantifiedThings: quantifiedThingsSelector,
    quantifiedPlaces: quantifiedPlacesSelector,
    toggledMarkers: toggledMarkersSelector,
    mapState: mapStateSelector
});
export default connect(selector)(GoogleMapsMarkers);
