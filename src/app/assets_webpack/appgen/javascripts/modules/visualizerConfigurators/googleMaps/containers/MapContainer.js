import React from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { Marker } from 'react-google-maps'
import MarkerClusterer from "react-google-maps/lib/addons/MarkerClusterer";
import GoogleMap from '../../../../misc/components/GoogleMap'
import { markersSelector } from '../ducks/markers'

const MapContainer = ({ markers }) => {
  return <GoogleMap>
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

const selector = createSelector(
  [markersSelector],
  markers => ({ markers })
);

export default connect(selector)(MapContainer);
