import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import {getPlacesCount} from "../ducks/counts";
import {getPlaces, getPlacesReset, placesSelector, placesStatusSelector} from "../ducks/places";
import {PromiseStatus} from "../../../core/models";
import PromiseResult from "../../../core/components/PromiseResult";
import Button from "../../../../components/Button";
import {limitSelector} from "../../../app/ducks/limit";
import {Paper} from "material-ui";
import RecordSelector from "../../../common/RecordSelector";
import {selectedPlaceTypesSelector, setSelectedPlaceTypesReset, setSelectPlaceType} from "../ducks/selectedPlaceTypes";
import CenteredMessage from "../../../../components/CenteredMessage";
import {thingsWithPlacesSelector} from "../ducks/thingsWithPlaces";

class PlacesLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.bool.isRequired,

        places: PropTypes.array.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,
        selectedPlaceTypes: PropTypes.instanceOf(ImmutableSet).isRequired,

        thingsWithPlaces: PropTypes.array.isRequired,
        limit: PropTypes.number.isRequired
    };

    load(thingsWithPlaces) {
        const {dispatch, selectedPlaceTypes, limit} = this.props;

        var urls = thingsWithPlaces.map(p => p.inner);
        dispatch(getPlaces(urls, [...selectedPlaceTypes], limit));
        dispatch(getPlacesCount(urls, [...selectedPlaceTypes]));
    }

    reload(thingsWithPlaces) {
        const {dispatch} = this.props;
        dispatch(setSelectedPlaceTypesReset());
        this.load(thingsWithPlaces);
    }

    componentWillMount() {
        const {isInitial, thingsWithPlaces} = this.props;
        if (isInitial) {
            this.load(thingsWithPlaces);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.thingsWithPlaces != this.props.thingsWithPlaces) {
            this.reload(nextProps.thingsWithPlaces);
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getPlacesReset());
        dispatch(setSelectedPlaceTypesReset());
    }

    render() {
        const {dispatch, places, status, selectedPlaceTypes, thingsWithPlaces} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading places..."/>
        }

        else if (places.length == 0) {
            return <CenteredMessage>No connected places were loaded. Check the settings please.</CenteredMessage>
        }

        var buttonsEnabled = selectedPlaceTypes.length > 0 || selectedPlaceTypes.length > 0;

        return <Paper>
            <RecordSelector
                records={places}
                header="Things Types:"
                getKey={t => t.outerType}
                getValue={t => t.outerType}
                selectedKeys={selectedPlaceTypes}
                onKeySelect={k => dispatch(setSelectPlaceType(k))}
                onKeyUnselect={k => dispatch(setSelectPlaceType(k))}
            />
            <Button raised={true}
                    onTouchTap={() => this.load(thingsWithPlaces)}
                    disabled={!buttonsEnabled}
                    label="LOAD"
            />
            <Button raised={true}
                    onTouchTap={() => this.reload(thingsWithPlaces)}
                    disabled={false}
                    label="RESET"
            />
            //TODO count
        </Paper>
    }
}

const selector = createStructuredSelector({
    places: placesSelector,
    status: placesStatusSelector,
    selectedPlaceTypes: selectedPlaceTypesSelector,
    thingsWithPlaces: thingsWithPlacesSelector,
    limit: limitSelector
});

export default connect(selector)(PlacesLoader);