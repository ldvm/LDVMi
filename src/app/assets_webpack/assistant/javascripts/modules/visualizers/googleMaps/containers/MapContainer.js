import React, {PropTypes} from "react";
import {List, Set} from "immutable";
import {createStructuredSelector} from "reselect";
import {connect, Provider} from "react-redux";
import {InfoWindow, Marker} from "react-google-maps";
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer";
import GoogleMap from "../../../../components/GoogleMap";
import Label from "../../../app/containers/Label";
import makePureRender from "../../../../misc/makePureRender";
import {mapStateSelector, updateMapState} from "../ducks/mapState";
import {markersSelector} from "../ducks/markers";
import {toggledMarkersSelector, toggleMarker} from "../ducks/toggledMarkers";
import {MapState} from "../models";

const MapContainer = ({dispatch, markers, mapState, toggledMarkers}, context) => {
    return <GoogleMap
        onZoomChanged={zoomLevel => dispatch(updateMapState({zoomLevel}))}
        onCenterChanged={center => dispatch(updateMapState({center}))}
        defaultZoom={mapState.zoomLevel}
        defaultCenter={mapState.center.toJS()}>

        <MarkerClusterer
            averageCenter
            enableRetinaIcons
            gridSize={60}>

            {markers.map((marker, index) =>
                <Marker
                    key={marker.uri}
                    position={marker.coordinates}
                    onClick={() => dispatch(toggleMarker(marker.uri))}
                    defaultAnimation={null}>

                    {toggledMarkers.contains(marker.uri) &&
                    <InfoWindow
                        key={marker.uri}
                        onCloseclick={() => dispatch(toggleMarker(marker.uri))}>

                        <Provider store={context.store}>
                            <Label uri={marker.uri} label={marker.title}/>
                        </Provider>
                    </InfoWindow>}
                </Marker>
            )}
        </MarkerClusterer>
    </GoogleMap>;
};

MapContainer.propTypes = {
    dispatch: PropTypes.func.isRequired,
    markers: PropTypes.instanceOf(List).isRequired,
    mapState: PropTypes.instanceOf(MapState).isRequired,
    toggledMarkers: PropTypes.instanceOf(Set).isRequired
};

MapContainer.contextTypes = {
    store: PropTypes.object.isRequired
};

const selector = createStructuredSelector({
    markers: markersSelector,
    mapState: mapStateSelector,
    toggledMarkers: toggledMarkersSelector
});

export default connect(selector)(makePureRender(MapContainer));
