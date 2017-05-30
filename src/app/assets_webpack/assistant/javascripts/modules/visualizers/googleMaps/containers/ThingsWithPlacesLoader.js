import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {Set as ImmutableSet} from "immutable";
import {getThingsWithPlacesCount} from "../ducks/counts";
import {PromiseStatus} from "../../../core/models";
import PromiseResult from "../../../core/components/PromiseResult";
import Button from "../../../../components/Button";
import {limitSelector} from "../../../app/ducks/limit";
import {Paper} from "material-ui";
import RecordSelector from "../../../common/RecordSelector";
import {selectedThingsSelector, setSelectedThingReset, setSelectThing} from "../ducks/selectedThings";
import {
    getThingsWithPlaces,
    getThingsWithPlacesReset,
    thingsWithPlacesSelector,
    thingsWithPlacesStatusSelector
} from "../ducks/thingsWithPlaces";
import {
    selectedPlaceConnectionsSelector,
    setSelectedPlaceConnectionsReset,
    setSelectPlaceConnection
} from "../ducks/selectedPlaceConnections";
import CountThingsContainer from "./CountThingsContainer";

class ThingsWithPlacesLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.bool.isRequired,

        things: PropTypes.array.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        selectedThings: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedPlaceConnections: PropTypes.instanceOf(ImmutableSet).isRequired,

        limit: PropTypes.number.isRequired
    };

    load() {
        const {dispatch, selectedThings, selectedPlaceConnections, limit} = this.props;

        dispatch(getThingsWithPlaces([...selectedThings], [], [...selectedPlaceConnections], limit));
        dispatch(getThingsWithPlacesCount([...selectedThings], [], [...selectedPlaceConnections]));
    }

    reset() {
        const {dispatch, limit} = this.props;
        dispatch(setSelectedThingReset());
        dispatch(setSelectedPlaceConnectionsReset());

        dispatch(getThingsWithPlaces([], [], [], limit));
        dispatch(getThingsWithPlacesCount([], [], []));
    }

    componentWillMount() {
        if (this.props.isInitial) {
            this.load();
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getThingsWithPlacesReset());
    }

    render() {
        const {dispatch, things, status, selectedThings, selectedPlaceConnections} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading connected things..."/>
        }

        var buttonsEnabled = selectedThings.size > 0 || selectedPlaceConnections.size > 0;

        return <Paper>
            <RecordSelector
                records={things}
                header="Things with places:"
                getKey={t => t.outer}
                getValue={t => t.outer}
                selectedKeys={selectedThings}
                onKeySelect={k => dispatch(setSelectThing(k))}
            />
            <RecordSelector
                records={things}
                header="Things to place connections:"
                getKey={t => t.connection}
                getValue={t => t.connection}
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
    things: thingsWithPlacesSelector,
    status: thingsWithPlacesStatusSelector,

    selectedThings: selectedThingsSelector,
    selectedPlaceConnections: selectedPlaceConnectionsSelector,

    limit: limitSelector
});

export default connect(selector)(ThingsWithPlacesLoader);