import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { Marker } from 'react-google-maps'
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer";
import GoogleMap from '../../../../misc/components/GoogleMap'
import makePureRender from '../../../../misc/makePureRender'
import { updateMapState } from '../ducks/mapState'
import { markersSelector } from '../ducks/markers'
import { mapStateSelector } from '../ducks/mapState'
import { MapState } from '../models'

const MapContainer = ({ dispatch, markers, mapState }) => {
  return <GoogleMap
      onZoomChanged={zoomLevel => dispatch(updateMapState({ zoomLevel }))}
      onCenterChanged={center => dispatch(updateMapState({ center }))}
      defaultZoom={mapState.zoomLevel}
      defaultCenter={mapState.center.toJS()}
    >
      <MarkerClusterer
        averageCenter
        enableRetinaIcons
        gridSize={60}
      >
        {markers.map((marker, index) =>
          <Marker
            key={marker.uri}
            position={marker.coordinates}
            defaultAnimation={null}
          />
        )}
      </MarkerClusterer>
    </GoogleMap>;
};

MapContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  markers: PropTypes.instanceOf(List).isRequired,
  mapState: PropTypes.instanceOf(MapState).isRequired
};

const selector = createSelector(
  [markersSelector, mapStateSelector],
  (markers, mapState) => ({ markers, mapState })
);

export default connect(selector)(makePureRender(MapContainer));
