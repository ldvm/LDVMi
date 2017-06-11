import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {PromiseStatus} from "../../../core/models";
import {createStructuredSelector} from "reselect";
import {firstLevelSelector, firstLevelStatusSelector, getFirstLevelReset} from "../ducks/firstLevel";
import {secondLevelSelector} from "../ducks/secondLevel";
import {limitSelector} from "../../../app/ducks/limit";
import {
    selectedFirstLevelTypesSelector,
    setSelectedFirstLevelTypesReset,
    setSelectFirstLevelType
} from "../ducks/selectedFirstLevelTypes";
import {
    selectedFirstLevelPredicatesSelector,
    setSelectedFirstLevelPredicatesReset,
    setSelectFirstLevelPredicate
} from "../ducks/selectedFirstLevelPredicates";
import PromiseResult from "../../../core/components/PromiseResult";
import RecordSelector from "../../../common/components/RecordSelector";
import CenteredMessage from "../../../../components/CenteredMessage";
import Button from "../../../../components/Button";
import {Paper} from "material-ui";
import CountFirstLevelContainer from "../components/CountFirstLevel";
import {Set as ImmutableSet} from "immutable";


class FirstLevelLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        isInitial: PropTypes.bool,

        // Levels
        firstLevel: PropTypes.instanceOf(Array).isRequired,
        secondLevel: PropTypes.instanceOf(Array).isRequired,

        // Level loading
        firstLevelLoader: PropTypes.func.isRequired,
        firstLevelCount: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // Value selectors
        selectedFirstLevelTypes: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedFirstLevelPredicates: PropTypes.instanceOf(ImmutableSet).isRequired,

        limit: PropTypes.number.isRequired
    };

    componentWillMount() {
        const {isInitial, secondLevel} = this.props;

        if (isInitial) {
            this.load(secondLevel);
        }
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, limit} = this.props;
        if (secondLevel != nextProps.secondLevel) {

            // Do not reset selected things on app startup
            if (secondLevel.length > 0) {
                dispatch(setSelectedFirstLevelTypesReset());
                dispatch(setSelectedFirstLevelPredicatesReset());

                var urls = nextProps.secondLevel.map(l => l.inner);
                dispatch(firstLevelLoader(urls, [], [], limit));
                dispatch(firstLevelCount(urls, [], []));
            }
            else {
                this.load(nextProps.secondLevel);
            }
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getFirstLevelReset());
        dispatch(setSelectedFirstLevelTypesReset());
        dispatch(setSelectedFirstLevelPredicatesReset());
    }

    load(secondLevel) {
        const {dispatch, firstLevelLoader, firstLevelCount, selectedFirstLevelTypes, selectedFirstLevelPredicates, limit} = this.props;

        var urls = secondLevel.map(l => l.inner);
        dispatch(firstLevelLoader(urls, [...selectedFirstLevelTypes], [...selectedFirstLevelPredicates], limit));
        dispatch(firstLevelCount(urls, [...selectedFirstLevelTypes], [...selectedFirstLevelPredicates]))
    }

    reset() {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, limit} = this.props;

        dispatch(setSelectedFirstLevelTypesReset());
        dispatch(setSelectedFirstLevelPredicatesReset());

        var urls = secondLevel.map(l => l.inner);

        dispatch(firstLevelLoader(urls, [], [], limit));
        dispatch(firstLevelCount(urls, [], []));
    }

    render() {
        const {dispatch, status, secondLevel, firstLevel, selectedFirstLevelTypes, selectedFirstLevelPredicates} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading things in first level..."/>
        }

        else if (firstLevel.length == 0) {
            return <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
        }

        var buttonsEnabled = selectedFirstLevelTypes.size > 0 || selectedFirstLevelPredicates.size > 0;

        return <Paper>
            <RecordSelector
                records={firstLevel}
                header="Thing Types:"
                getKey={t => t.outerType}
                selectedKeys={selectedFirstLevelTypes}
                onKeySelect={k => dispatch(setSelectFirstLevelType(k))}
            />
            <RecordSelector
                records={firstLevel}
                header="Predicates:"
                getKey={t => t.predicate}
                selectedKeys={selectedFirstLevelPredicates}
                onKeySelect={k => dispatch(setSelectFirstLevelPredicate(k))}
            />
            <Button raised={true}
                    primary={true}
                    onTouchTap={() => this.load(secondLevel)}
                    disabled={!buttonsEnabled}
                    label="LOAD"
            />
            <Button raised={true}
                    onTouchTap={() => this.reset()}
                    disabled={false}
                    label="RESET"
            />
            <CountFirstLevelContainer/>
        </Paper>
    }
}

const selector = createStructuredSelector({
    firstLevel: firstLevelSelector,
    secondLevel: secondLevelSelector,
    status: firstLevelStatusSelector,
    selectedFirstLevelTypes: selectedFirstLevelTypesSelector,
    selectedFirstLevelPredicates: selectedFirstLevelPredicatesSelector,
    limit: limitSelector
});

export default connect(selector)(FirstLevelLoader);
