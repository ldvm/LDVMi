import React from 'react'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import { Marker } from 'react-google-maps'
import GoogleMap from '../../../../misc/components/GoogleMap'
import { markersSelector } from '../selector'

const MapContainer = ({ markers }) => {
  return <GoogleMap>
    {markers.map((marker, index) => <Marker
      key={marker.uri}
      position={marker.coordinates}
      defaultAnimation={2} /> )}
  </GoogleMap>;
};

const selector = createSelector(
  [markersSelector],
  markers => ({ markers })
);

export default connect(selector)(MapContainer);
