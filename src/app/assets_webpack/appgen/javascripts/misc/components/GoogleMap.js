import React, { Component } from 'react'
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader'
import _ from 'lodash'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'
import { triggerEvent } from 'react-google-maps/lib/utils'
import CenteredMessage from './CenteredMessage'

export default class Map extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = _.throttle(::this.handleWindowResize, 500);
  }

  componentDidMount() {
    window.addEventListener(`resize`, this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener(`resize`, this.handleWindowResize);
  }

  handleWindowResize() {
    triggerEvent(this._googleMapComponent, `resize`);
  }

  renderLoadingBar() {
    return <div style={{ position: 'relative', top: '50%' }}>
        <CenteredMessage>Loading Google Maps...</CenteredMessage>
      </div>
  }

  renderContainer() {
    return <div {...this.props} style={{ height: `100%` }}></div>;
  }

  renderGoogleMap() {
    return <GoogleMap
      ref={(map) => (this._googleMapComponent = map)}
      defaultZoom={3}
      defaultCenter={{ lat: -25.363882, lng: 131.044922 }}
    >
      {this.props.children}
    </GoogleMap>
  }

  render() {
    return (
      <ScriptjsLoader
        hostname={"maps.googleapis.com"}
        pathname={"/maps/api/js"}
        query={{v: `3`, libraries: "geometry,drawing,places"}}
        loadingElement={this.renderLoadingBar()}
        containerElement={this.renderContainer()}
        googleMapElement={this.renderGoogleMap()}
      />
    );
  }
}
