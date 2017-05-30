import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";

import {coordinatesSelector} from "../ducks/coordinates";
import {placesSelector} from "../ducks/places";
import {thingsWithPlacesSelector} from "../ducks/thingsWithPlaces";

import Label from "../../../app/containers/Label";
import Comment from "../../../app/containers/Comment";
import makePureRender from "../../../../misc/makePureRender";

class MapMarker extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        coordinates: PropTypes.array.isRequired,
        places: PropTypes.array.isRequired,
        thingsWithPlaces: PropTypes.array.isRequired
    };

    coordinate() {
        const {url, coordinates} = this.props;
        for (const c of coordinates) {
            if (c.url == url) {
                return <div>
                    <Label uri={url}/>
                    <br/>
                    <Comment uri={url}/>
                </div>
            }
        }
        return <div/>
    }

    // Place connected to the coordinates
    connectPlaces() {
        const {places, url} = this.props;
        for (const p of places) {
            // place connected to coordinates
            if (p.inner == url) {
                return <div>
                    <hr/>
                    <b>Place:</b>
                    <Label uri={p.outer}/><br/>
                    <Comment uri={p.outer}/>
                    <hr/>
                    {this.connectThings(p.outer)}
                </div>;
            }
        }
        return "";
    }

    // Thing connected to the place
    connectThings(placeUrl) {
        const {thingsWithPlaces} = this.props;
        for (const t of thingsWithPlaces) {
            // Thing connected to place
            if (t.inner == placeUrl) {
                return <div>
                    <b>Connected thing:</b>
                    <Label uri={t.outer}/><br/>
                    <Comment uri={t.outer}/>
                    <hr/>
                    <b>Connected via:</b>
                    <Label uri={t.connection}/><br/>
                    <Comment uri={t.connection}/>
                </div>
            }
        }
        return "";
    }

    render() {
        return <div>
            {this.coordinate()}
            <br/>
            {this.connectPlaces()}
        </div>
    }
}

const selector = createStructuredSelector({
    coordinates: coordinatesSelector,
    places: placesSelector,
    thingsWithPlaces: thingsWithPlacesSelector
});

export default connect(selector)(makePureRender(MapMarker));