import React, { Component, PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import { Set as ImmutableSet } from 'immutable'
import { InfoWindow, Marker } from 'react-google-maps'
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer'
import GoogleMap from '../../../../components/GoogleMap'
import { mapStateSelector, updateMapState } from '../ducks/mapState'
import { toggledMarkersSelector, toggleMarker } from '../ducks/toggledMarkers'
import { coordinatesSelector } from '../ducks/coordinates'
import MapMarker from './MapMarkerInfoWindow'
import { MapState } from '../models'
import { createStructuredSelector } from 'reselect'

class GoogleMapsMarkers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    coordinates: PropTypes.instanceOf(Array).isRequired,

    mapState: PropTypes.instanceOf(MapState).isRequired,
    toggledMarkers: PropTypes.instanceOf(ImmutableSet).isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  infoWindow(url) {
    const { toggledMarkers, dispatch } = this.props;
    if (toggledMarkers.contains(url)) {
      return (
        <InfoWindow
          key={url}
          onCloseclick={() => dispatch(toggleMarker(url))}>

          <Provider store={this.context.store}>
            <MapMarker url={url}/>
          </Provider>
        </InfoWindow>
      );
    }
    return '';
  }

  marker(coors) {
    const { dispatch } = this.props;

    const position = {
      lat: parseFloat(coors.latitude.toFixed(5)),
      lng: parseFloat(coors.longitude.toFixed(5))
    };

    return (
      <Marker key={coors.url}
              position={position}
              onClick={() => dispatch(toggleMarker(coors.url))}
              defaultAnimation={null}>
        {this.infoWindow(coors.url)}
      </Marker>
    )
  }

  render() {
    const { dispatch, coordinates, mapState } = this.props;
    return (
      <GoogleMap
        onZoomChanged={zoomLevel => dispatch(updateMapState({ zoomLevel }))}
        onCenterChanged={center => dispatch(updateMapState({ center }))}
        defaultZoom={mapState.zoomLevel}
        defaultCenter={mapState.center.toJS()}>

        <MarkerClusterer averageCenter
                         enableRetinaIcons
                         gridSize={60}
        >
          {coordinates.map(c => this.marker(c))}
        </MarkerClusterer>
      </GoogleMap>
    );
  };
}

const selector = createStructuredSelector({
  coordinates: coordinatesSelector,
  toggledMarkers: toggledMarkersSelector,
  mapState: mapStateSelector
});
export default connect(selector)(GoogleMapsMarkers);
