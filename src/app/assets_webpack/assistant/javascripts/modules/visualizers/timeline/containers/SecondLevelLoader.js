import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {getSecondLevelReset, secondLevelSelector, secondLevelStatusSelector} from "../ducks/secondLevel";
import {limitSelector} from "../../../app/ducks/limit";
import {selectedThingSLSelector, setSelectedThingSLReset, setSelectThingSL} from "../ducks/selectedThingSecondLevel";
import {
    selectedPredicateSLSelector,
    setSelectedSecondLevelPredicatesReset,
    setSelectSecondLevelPredicate
} from "../ducks/selectedSecondLevelPredicates";
import {PromiseStatus} from "../../../core/models";
import {createStructuredSelector} from "reselect";
import PromiseResult from "../../../core/components/PromiseResult";
import RecordSelector from "../../../common/RecordSelector";
import CenteredMessage from "../../../../components/CenteredMessage";
import Button from "../../../../components/Button";
import {Paper} from "material-ui";
import CountSecondLevelContainer from "./CountSecondLevelContainer";
import {Set as ImmutableSet} from "immutable";

class SecondLevelLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.bool,

        // Levels
        secondLevel: PropTypes.instanceOf(Array).isRequired,

        // Level loading
        secondLevelLoader: PropTypes.func.isRequired,
        secondLevelCount: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // Value selectors
        selectedThingSL: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedSecondLevelPredicates: PropTypes.instanceOf(ImmutableSet).isRequired,

        limit: PropTypes.number.isRequired
    };

    componentWillMount() {
        if (this.props.isInitial) this.load();
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getSecondLevelReset());
        dispatch(setSelectedThingSLReset());
        dispatch(setSelectedSecondLevelPredicatesReset());
    }

    load() {
        const {dispatch, secondLevelLoader, secondLevelCount, selectedThingSL, selectedSecondLevelPredicates, limit} = this.props;
        dispatch(secondLevelLoader([...selectedThingSL], [], [...selectedSecondLevelPredicates], limit));
        dispatch(secondLevelCount([...selectedThingSL], [], [...selectedSecondLevelPredicates]));
    }

    reset() {
        const {dispatch, secondLevelLoader, secondLevelCount, limit} = this.props;

        dispatch(setSelectedThingSLReset());
        dispatch(setSelectedSecondLevelPredicatesReset());

        dispatch(secondLevelLoader([], [], [], limit));
        dispatch(secondLevelCount([], [], []));
    }

    render() {
        const {dispatch, status, secondLevel, selectedThingSL, selectedSecondLevelPredicates} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading things in second level..."/>
        }

        else if (secondLevel.length == 0) {
            return <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
        }

        var buttonsEnabled = selectedThingSL.size > 0 || selectedSecondLevelPredicates.size > 0;

        return <Paper>
            <RecordSelector
                records={secondLevel}
                header="Things:"
                getKey={t => t.outer}
                selectedKeys={selectedThingSL}
                onKeySelect={k => dispatch(setSelectThingSL(k))}
            />
            <RecordSelector
                records={secondLevel}
                header="Predicates:"
                getKey={t => t.predicate}
                selectedKeys={selectedSecondLevelPredicates}
                onKeySelect={k => dispatch(setSelectSecondLevelPredicate(k))}
            />
            <Button raised={true}
                    primary={true}
                    onTouchTap={() => this.load()}
                    disabled={!buttonsEnabled}
                    label="LOAD"
            />
            <Button raised={true}
                    onTouchTap={() => this.reset()}
                    disabled={false}
                    label="RESET"
            />
            <CountSecondLevelContainer/>
        </Paper>
    }
}

const selector = createStructuredSelector({
    secondLevel: secondLevelSelector,
    status: secondLevelStatusSelector,
    selectedThingSL: selectedThingSLSelector,
    selectedSecondLevelPredicates: selectedPredicateSLSelector,
    limit: limitSelector
});

export default connect(selector)(SecondLevelLoader);
