import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {coordinatesSelector} from "../ducks/coordinates";
import {placesSelector} from "../ducks/places";
import {quantifiedThingsSelector} from "../ducks/quantifiedThings";
import Label from "../../../app/containers/Label";
import Comment from "../../../app/containers/Comment";
import makePureRender from "../../../../misc/makePureRender";
import {quantifiedPlacesSelector} from "../ducks/quantifiedPlaces";

class MapMarkerInfoWindow extends Component {
    static propTypes = {
        url: PropTypes.string.isRequired,
        coordinates: PropTypes.array.isRequired,
        places: PropTypes.array.isRequired,
        quantifiedThings: PropTypes.array.isRequired,
        quantifiedPlaces: PropTypes.array.isRequired,
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

    // Places connected to the coordinates
    connectPlaces() {
        const {places, quantifiedPlaces, url} = this.props;

        // Places + Quantified Things connected to them
        var connectedPlaces = [];
        for (const p of places) {
            if (p.coordinates == url) {
                connectedPlaces.add(
                    <div key={p.url}>
                        <hr/>

                        <b>Place:</b>
                        <Label uri={p.url}/><br/>
                        <Comment uri={p.url}/><br/>

                        {this.connectQuantifiedThings(p.url)}

                        <hr/>
                    </div>
                );
            }
        }

        // Quantified places
        for (const p of quantifiedPlaces) {
            if (p.coordinates == url) {
                connectedPlaces.add(
                    <div key={p.url}>
                        <hr/>

                        <b>Place:</b>
                        <Label uri={p.url}/><br/>
                        <Comment uri={p.url}/><br/>

                        <b>Value:</b>
                        <p>p.value</p>

                        <b>Value connection</b>
                        <Label uri={p.valueConnection}/><br/>
                        <Comment uri={p.valueConnection}/><br/>

                        <hr/>
                    </div>
                );
            }
        }
        return connectedPlaces;
    }

    // Quantified things connected to the place
    connectQuantifiedThings(placeUrl) {
        const {quantifiedThings} = this.props;

        var connectedQuantifiedThings = [];
        for (const t of quantifiedThings) {
            if (t.place == placeUrl) {
                connectedQuantifiedThings.add(
                    <div>
                        <hr/>

                        <b>Connected thing:</b>
                        <Label uri={t.url}/><br/>
                        <Comment uri={t.url}/><br/>

                        <b>Connected via:</b>
                        <Label uri={t.placeConnection}/><br/>
                        <Comment uri={t.placeConnection}/><br/>

                        <b>Value:</b>
                        <p>t.value</p>

                        <b>Value connected via:</b>
                        <Label uri={t.valueConnection}/><br/>
                        <Comment uri={t.valueConnection}/><br/>

                        <hr/>
                    </div>
                );
            }
        }
        return connectedQuantifiedThings;
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
    quantifiedThings: quantifiedThingsSelector,
    quantifiedPlaces: quantifiedPlacesSelector
});

export default connect(selector)(makePureRender(MapMarkerInfoWindow));