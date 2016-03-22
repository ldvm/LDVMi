import React, { Component } from 'react'
import ScriptjsLoader from 'react-google-maps/lib/async/ScriptjsLoader'
import throttle from 'lodash/throttle'
import { GoogleMapLoader, GoogleMap, Marker } from 'react-google-maps'
import { triggerEvent } from 'react-google-maps/lib/utils'
import CenteredMessage from './CenteredMessage'

export default class Map extends Component {

  constructor(props, context) {
    super(props, context);
    this.handleWindowResize = throttle(::this.handleWindowResize, 500);
    this.handleZoomChanged = throttle(::this.handleZoomChanged, 1000);
    this.handleCenterChanged = throttle(::this.handleCenterChanged, 1000);
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

  handleZoomChanged() {
    const zoomLevel = this._googleMapComponent.getZoom();
    if (this.props.onZoomChanged) {
      this.props.onZoomChanged(zoomLevel);
    }
  }

  handleCenterChanged() {
    const center = {
      lat: this._googleMapComponent.getCenter().lat(),
      lng: this._googleMapComponent.getCenter().lng()
    };
    if (this.props.onCenterChanged) {
      this.props.onCenterChanged(center);
    }
  }

  renderLoadingBar() {
    return <div style={{ position: 'relative', top: '50%' }}>
        <CenteredMessage>Loading Google Maps...</CenteredMessage>
      </div>
  }

  renderContainer() {
    return <div style={{ height: `100%` }}></div>;
  }

  renderGoogleMap() {
    return <GoogleMap
      ref={(map) => (this._googleMapComponent = map)}
      defaultZoom={0}
      defaultCenter={{ lat: 0, lng: 0 }}
      {...this.props}
      onZoomChanged={::this.handleZoomChanged}
      onCenterChanged={::this.handleCenterChanged}
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
