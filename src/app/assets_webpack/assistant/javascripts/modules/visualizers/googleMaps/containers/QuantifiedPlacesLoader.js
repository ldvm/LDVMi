import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import {getQuantifiedPlacesCount} from "../ducks/counts";
import {PromiseStatus} from "../../../core/models";
import PromiseResult from "../../../core/components/PromiseResult";
import Button from "../../../../components/Button";
import {limitSelector} from "../../../app/ducks/limit";
import {Paper} from "material-ui";
import RecordSelector from "../../../common/RecordSelector";
import {selectedPlaceTypesSelector, setSelectedPlaceTypesReset, setSelectPlaceType} from "../ducks/selectedPlaceTypes";
import {
    getQuantifiedPlaces,
    getQuantifiedPlacesReset,
    quantifiedPlacesSelector,
    quantifiedPlacesStatusSelector
} from "../ducks/quantifiedPlaces";
import {
    selectedValueConnectionsSelector,
    setSelectedValueConnectionsReset,
    setSelectValueConnection
} from "../ducks/selectedValueConnections";
import CountQuantifiedPlacesContainer from "./CountQuantifiedPlacesContainer";

class QuantifiedPlacesLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Value loading
        quantifiedPlaces: PropTypes.array.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // User selections
        selectedPlaceTypes: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedValueConnections: PropTypes.instanceOf(ImmutableSet).isRequired,

        // Other
        isInitial: PropTypes.bool.isRequired,
        limit: PropTypes.number.isRequired
    };

    load() {
        const {dispatch, selectedPlaceTypes, selectedValueConnections, limit} = this.props;

        dispatch(getQuantifiedPlaces([], [...selectedPlaceTypes], [...selectedValueConnections], limit));
        dispatch(getQuantifiedPlacesCount([], [...selectedPlaceTypes], [...selectedValueConnections]));
    }

    reload() {
        const {dispatch, limit} = this.props;

        dispatch(setSelectedPlaceTypesReset());
        dispatch(setSelectedValueConnectionsReset());

        dispatch(getQuantifiedPlaces([], [], [], limit));
        dispatch(getQuantifiedPlacesCount([], [], []));
    }

    componentWillMount() {
        const {isInitial, quantifiedThings} = this.props;
        if (isInitial) {
            this.load(quantifiedThings);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.quantifiedThings != this.props.quantifiedThings) {
            this.reload(nextProps.quantifiedThings);
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getQuantifiedPlacesReset());
        dispatch(setSelectedPlaceTypesReset());
        dispatch(setSelectedValueConnectionsReset());
    }

    render() {
        const {dispatch, quantifiedPlaces, status, selectedPlaceTypes, selectedValueConnections} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading quantified places..."/>
        }

        var buttonsEnabled = selectedPlaceTypes.size > 0 || selectedValueConnections.size > 0;

        return <Paper>
            <RecordSelector
                records={quantifiedPlaces}
                header="Places Types:"
                getKey={t => t.placeType}
                getValue={t => t.placeType}
                selectedKeys={selectedPlaceTypes}
                onKeySelect={k => dispatch(setSelectPlaceType(k))}
            />
            <RecordSelector
                records={quantifiedPlaces}
                header="Value Connections:"
                getKey={t => t.valueConnection}
                getValue={t => t.valueConnection}
                selectedKeys={selectedPlaceTypes}
                onKeySelect={k => dispatch(setSelectValueConnection(k))}
            />
            <Button raised={true}
                    primary={true}
                    onTouchTap={() => this.load()}
                    disabled={!buttonsEnabled}
                    label="LOAD"
            />
            <Button raised={true}
                    onTouchTap={() => this.reload()}
                    disabled={false}
                    label="RESET"
            />
            <CountQuantifiedPlacesContainer/>
        </Paper>
    }
}

const selector = createStructuredSelector({
    quantifiedPlaces: quantifiedPlacesSelector,
    status: quantifiedPlacesStatusSelector,

    selectedPlaceTypes: selectedPlaceTypesSelector,
    selectedValueConnections: selectedValueConnectionsSelector,

    limit: limitSelector
});

export default connect(selector)(QuantifiedPlacesLoader);