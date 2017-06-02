import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import {getQuantifiedThingsCount} from "../ducks/counts";
import {PromiseStatus} from "../../../core/models";
import PromiseResult from "../../../core/components/PromiseResult";
import Button from "../../../../components/Button";
import {limitSelector} from "../../../app/ducks/limit";
import {Paper} from "material-ui";
import RecordSelector from "../../../common/RecordSelector";
import CountThingsContainer from "./CountQuantifiedThingsContainer";
import {
    selectedQuantifiedThingsSelector,
    setSelectedQuantifiedThingsReset,
    setSelectQuantifiedThing
} from "../ducks/selectedQuantifiedThings";
import {
    getQuantifiedThings,
    getQuantifiedThingsReset,
    quantifiedThingsSelector,
    quantifiedThingsStatusSelector
} from "../ducks/quantifiedThings";
import {
    selectedPlaceConnectionsSelector,
    setSelectedPlaceConnectionsReset,
    setSelectPlaceConnection
} from "../ducks/selectedPlaceConnections";
import {
    selectedValueConnectionsSelector,
    setSelectedValueConnectionsReset,
    setSelectValueConnection
} from "../ducks/selectedValueConnections";

class QuantifiedThingsLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Value loading
        quantifiedThings: PropTypes.array.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // User selections
        selectedThings: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedPlaceConnections: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedValueConnections: PropTypes.instanceOf(ImmutableSet).isRequired,

        // Other
        isInitial: PropTypes.bool.isRequired,
        limit: PropTypes.number.isRequired
    };

    load() {
        const {dispatch, selectedThings, selectedValueConnections, selectedPlaceConnections, limit} = this.props;

        dispatch(getQuantifiedThings([...selectedThings], [...selectedValueConnections], [...selectedPlaceConnections], limit));
        dispatch(getQuantifiedThingsCount([...selectedThings], [...selectedValueConnections], [...selectedPlaceConnections]));
    }

    reset() {
        const {dispatch, limit} = this.props;
        dispatch(setSelectedQuantifiedThingsReset());
        dispatch(setSelectedPlaceConnectionsReset());
        dispatch(setSelectedValueConnectionsReset());

        dispatch(getQuantifiedThings([], [], [], limit));
        dispatch(getQuantifiedThingsCount([], [], []));
    }

    componentWillMount() {
        if (this.props.isInitial) {
            this.load();
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(setSelectedQuantifiedThingsReset());
        dispatch(setSelectedPlaceConnectionsReset());
        dispatch(setSelectedValueConnectionsReset());
        dispatch(getQuantifiedThingsReset());
    }

    render() {
        const {dispatch, quantifiedThings, status, selectedThings, selectedValueConnections, selectedPlaceConnections} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading connected quantified things..."/>
        }

        var buttonsEnabled = selectedThings.size > 0
            || selectedValueConnections.size > 0
            || selectedPlaceConnections.size > 0;

        return <Paper>
            <RecordSelector
                records={quantifiedThings}
                header="Things with places:"
                getKey={t => t.url}
                getValue={t => t.url}
                selectedKeys={selectedThings}
                onKeySelect={k => dispatch(setSelectQuantifiedThing(k))}
            />
            <RecordSelector
                records={quantifiedThings}
                header="Value connections"
                getKey={t => t.valueConnection}
                getValue={t => t.valueConnection}
                selectedKeys={selectedValueConnections}
                onKeySelect={k => dispatch(setSelectValueConnection(k))}
            />
            <RecordSelector
                records={quantifiedThings}
                header="Place connections"
                getKey={t => t.placeConnection}
                getValue={t => t.placeConnection}
                selectedKeys={selectedPlaceConnections}
                onKeySelect={k => dispatch(setSelectPlaceConnection(k))}
            />
            <Button raised={true}
                    onTouchTap={() => this.load()}
                    disabled={!buttonsEnabled}
                    label="LOAD"
            />
            <Button raised={true}
                    onTouchTap={() => this.reset()}
                    disabled={false}
                    label="RESET"
            />
            <CountThingsContainer/>
        </Paper>
    }
}

const selector = createStructuredSelector({
    quantifiedThings: quantifiedThingsSelector,
    status: quantifiedThingsStatusSelector,

    selectedThings: selectedQuantifiedThingsSelector,
    selectedValueConnections: selectedValueConnectionsSelector,
    selectedPlaceConnections: selectedPlaceConnectionsSelector,

    limit: limitSelector
});

export default connect(selector)(QuantifiedThingsLoader);