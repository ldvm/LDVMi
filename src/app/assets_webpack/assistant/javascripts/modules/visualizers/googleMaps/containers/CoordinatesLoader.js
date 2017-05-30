import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {
    coordinatesSelector,
    coordinatesStatusSelector,
    getCoordinates,
    getCoordinatesReset
} from "../ducks/coordinates";
import {coordinatesCountSelector, coordinatesCountStatusSelector, getCoordinatesCount} from "../ducks/counts";
import {placesSelector} from "../ducks/places";
import {PromiseStatus} from "../../../core/models";
import PromiseResult from "../../../core/components/PromiseResult";
import Button from "../../../../components/Button";
import {limitSelector} from "../../../app/ducks/limit";
import CountCoordinatesContainer from "./CountCoordinatesContainer";

class CoordinatesLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.bool.isRequired,

        coordinates: PropTypes.array.isRequired,
        coordinatesStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

        coordinatesCount: PropTypes.array.isRequired,
        coordinatesCountStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

        places: PropTypes.array.isRequired,
        limit: PropTypes.number.isRequired
    };

    load(places) {
        const {dispatch, limit} = this.props;

        var urls = places.map(p => p.inner);
        dispatch(getCoordinates(urls, limit));
        dispatch(getCoordinatesCount(urls));
    }

    componentWillMount() {
        const {isInitial, places} = this.props;

        if (isInitial) {
            this.load(places);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.places != this.props.places) {
            this.load(nextProps.places);
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getCoordinatesReset());
    }

    render() {
        const {coordinatesStatus, places} = this.props;

        if (!coordinatesStatus.done) {
            return <PromiseResult status={coordinatesStatus} error={coordinatesStatus.error}
                                  loadingMessage="Loading coordinates..."/>
        }

        return <div>
            <CountCoordinatesContainer/>
            <br/>
            <Button raised={true}
                    onTouchTap={() => this.load(places)}
                    disabled={false}
                    label="RELOAD"
            />
        </div>
    }
}

const selector = createStructuredSelector({
    coordinates: coordinatesSelector,
    coordinatesStatus: coordinatesStatusSelector,

    coordinatesCount: coordinatesCountSelector,
    coordinatesCountStatus: coordinatesCountStatusSelector,

    places: placesSelector,
    limit: limitSelector
});

export default connect(selector)(CoordinatesLoader);