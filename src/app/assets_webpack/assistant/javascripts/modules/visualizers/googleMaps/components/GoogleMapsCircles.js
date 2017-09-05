import React, { Component, PropTypes } from 'react'
import { connect, Provider } from 'react-redux'
import { Map as ImmutableMap, Set as ImmutableSet } from 'immutable'
import { Circle, InfoWindow } from 'react-google-maps'
import GoogleMap from '../../../../components/GoogleMap'
import { mapStateSelector, updateMapState } from '../ducks/mapState'
import { toggledMarkersSelector, toggleMarker } from '../ducks/toggledMarkers'
import { coordinatesSelector } from '../ducks/coordinates'
import MapMarker from './MapMarkerInfoWindow'
import { MapState } from '../models'
import { createStructuredSelector } from 'reselect'
import { placesSelector } from '../ducks/places'
import { quantifiedThingsSelector } from '../ducks/quantifiedThings'
import { quantifiedPlacesSelector } from '../ducks/quantifiedPlaces'
import { colorsSelector, setColors, setColorsReset } from '../ducks/colors'

class GoogleMapsMarkers extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    coordinates: PropTypes.instanceOf(Array).isRequired,
    places: PropTypes.array.isRequired,
    quantifiedThings: PropTypes.array.isRequired,
    quantifiedPlaces: PropTypes.array.isRequired,

    mapState: PropTypes.instanceOf(MapState).isRequired,
    toggledMarkers: PropTypes.instanceOf(ImmutableSet).isRequired,

    colors: PropTypes.instanceOf(ImmutableMap).isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  getColor(url) {
    if (this.colors.has(url)) {
      return this.colors.get(url);
    }
    else {
      var color = '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);
      this.colors = this.colors.set(url, color);
      return color;
    }
  }

  // === MARKERS ===
  infoWindow(coors) {
    const { toggledMarkers, dispatch } = this.props;

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

    return '';
  }

  getQuantifiedThingConnection(url) {
    const { places, quantifiedThings } = this.props;

    for (const place of places) {
      if (place.coordinates == url) {
        for (const thing of quantifiedThings) {
          if (thing.place == place.url) {
            return { thing: thing, place: place };
          }
        }
      }
    }
    return null;
  }

  getQuantifiedPlaceConnection(url) {
    const { quantifiedPlaces } = this.props;

    for (const place of quantifiedPlaces) {
      if (place.coordinates == url) {
        return { quantifiedPlace: place };
      }
    }
    return null;
  }

  // === CIRCLES ===
  getMaxOfAllValues() {
    const { quantifiedPlaces, quantifiedThings } = this.props;

    var qpvMax = Math.max.apply(null, quantifiedPlaces.map(p => p.value));
    var qtvMax = Math.max.apply(null, quantifiedThings.map(t => t.value));

    return (qtvMax > qpvMax) ? qtvMax : qpvMax;
  }

  circle(coordinates, maxValue) {
    const { dispatch, mapState } = this.props;

    // Adjusting radius & stroke to zoom levels
    const nonZeroZoom = 1 + mapState.zoomLevel;

    const MAX_RADIUS = (1000 / (nonZeroZoom * nonZeroZoom)) * 1000; // Radius is in meters...
    const MAX_STROKE_W = nonZeroZoom;

    var value = 0;
    var placeType = 'default_place_type';
    var valuePredicate = 'default_value_predicate';

    // Values for radius, Place type & Value predicate for colors

    // From quantified thing
    var qt = this.getQuantifiedThingConnection(coordinates.url);

    if (qt != null) {
      value = qt.thing.value;
      placeType = qt.place.placeType;
      valuePredicate = qt.thing.valuePredicate;
    }

    // From quantifiedPlace
    var qp = this.getQuantifiedPlaceConnection(coordinates.url);
    if (qp != null) {
      value = qp.quantifiedPlace.value;
      placeType = qp.quantifiedPlace.placeType;
      valuePredicate = qp.quantifiedPlace.valuePredicate;
    }

    // Map radius to (0,maxRadius)
    const radius = (value / maxValue) * MAX_RADIUS;

    // Stroke
    const strokeWidth = 1 + parseInt((value / maxValue) * MAX_STROKE_W);

    // Colors
    const strokeColor = this.getColor(valuePredicate);
    const fillColor = this.getColor(placeType);

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
        onClick={() => dispatch(toggleMarker(coordinates.url))}
        options={{
          strokeColor: strokeColor,
          strokeOpacity: 1,
          strokeWeight: strokeWidth,
          fillColor: fillColor,
          fillOpacity: 0.5
        }}
      />
    );
  }

  // === RENDER ===
  componentDidMount() {
    this.colors = this.props.colors;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.colors != this.props.colors) {
      this.colors = nextProps.colors;
    }
  }

  componentDidUpdate() {
    const { dispatch } = this.props;
    if (this.props.colors != this.colors) {
      dispatch(setColors(this.colors));
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setColorsReset());
  }

  render() {
    const { dispatch, coordinates, mapState } = this.props;

    var maxValue = this.getMaxOfAllValues();
    return (
      <GoogleMap
        onZoomChanged={zoomLevel => dispatch(updateMapState({ zoomLevel }))}
        onCenterChanged={center => dispatch(updateMapState({ center }))}
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
  mapState: mapStateSelector,

  colors: colorsSelector
});
export default connect(selector)(GoogleMapsMarkers);
