import React from 'react'
import { Marker } from 'react-google-maps'
import GoogleMap from '../../../../misc/components/GoogleMap'

const markers = [{
  position: {
    lat: 25.0112183,
    lng: 121.52067570000001
  },
  key: `Taiwan`,
  defaultAnimation: 2
}, {
  position: {
    lat: 24.0112183,
    lng: 120.52067570000001
  },
  key: `Another Taiwan`,
  defaultAnimation: 2
}];

const MapContainer = () => {
  return <GoogleMap>
    {markers.map((marker, index) => <Marker {...marker} /> )}
  </GoogleMap>;
};

export default MapContainer;