import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {Set as ImmutableSet} from "immutable";
import {Circle} from "react-google-maps";
import GoogleMap from "../../../../components/GoogleMap";
import {mapStateSelector, updateMapState} from "../ducks/mapState";
import {toggledMarkersSelector, toggleMarker} from "../ducks/toggledMarkers";
import {coordinatesSelector, coordinatesStatusSelector, getCoordinates} from "../ducks/coordinates";
import {MapState} from "../models";
import {createStructuredSelector} from "reselect";
import makePureRender from "../../../../misc/makePureRender";

class GoogleMapsCircles extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.bool.isRequired,

        coordinates: PropTypes.instanceOf(Array).isRequired,
        mapState: PropTypes.instanceOf(MapState).isRequired
    };

    static contextTypes = {
        store: PropTypes.object.isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getCoordinates([], 10));
    }

    render() {
        const {dispatch, coordinates, mapState} = this.props;
        debugger;
        return (
            <GoogleMap
                onZoomChanged={zoomLevel => dispatch(updateMapState({zoomLevel}))}
                onCenterChanged={center => dispatch(updateMapState({center}))}
                defaultZoom={mapState.zoomLevel}
                defaultCenter={mapState.center.toJS()}>

                {coordinates.map(c => {
                        const coorsMapFormat = {
                            lat: parseFloat(c.latitude.toFixed(5)),
                            lng: parseFloat(c.longitude.toFixed(5))
                        };

                        return <Circle
                            key={c.url}
                            center={coorsMapFormat}

                            radius={20}
                            strokeColor={"#0000FF"}
                            strokeOpacity={0.8}
                            strokeWeight={2}
                            fillColor={"#0000FF"}
                            fillOpacity={0.4}
                            onClick={() => {
                                dispatch(toggleMarker(c.url))
                            }}/>
                    }
                )}
            </GoogleMap>
        );
    }
}


const selector = createStructuredSelector({
    coordinates: coordinatesSelector,
    coordStatus: coordinatesStatusSelector,
    toggledMarkers: toggledMarkersSelector,
    mapState: mapStateSelector
});


export default connect(selector)(makePureRender(GoogleMapsCircles));
