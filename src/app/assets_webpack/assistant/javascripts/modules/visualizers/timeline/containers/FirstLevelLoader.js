import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {PromiseStatus} from "../../../core/models";
import {createStructuredSelector} from "reselect";
import {firstLevelSelector, firstLevelStatusSelector, getFirstLevelReset} from "../ducks/firstLevel";
import {secondLevelSelector} from "../ducks/secondLevel";
import {limitSelector} from "../../../app/ducks/limit";
import {selectedTypeFLSelector, setSelectedTypeFLReset, setSelectTypeFL} from "../ducks/selectedTypeFirstLevel";
import {selectedConnFLSelector, setSelectConnFL, setSelectedConnFLReset} from "../ducks/selectedConnFirstLevel";
import PromiseResult from "../../../core/components/PromiseResult";
import RecordSelector from "../../../common/RecordSelector";
import CenteredMessage from "../../../../components/CenteredMessage";
import Button from "../../../../components/Button";
import {Paper} from "material-ui";
import CountFirstLevelContainer from "./CountFirstLevelContainer";
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
        selectedTypeFL: PropTypes.instanceOf(ImmutableSet).isRequired,
        selectedConnFL: PropTypes.instanceOf(ImmutableSet).isRequired,

        limit: PropTypes.number.isRequired
    };

    componentWillMount() {
        if (this.props.isInitial) this.load();
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, limit} = this.props;
        if (secondLevel != nextProps.secondLevel) {
            dispatch(setSelectedTypeFLReset());
            dispatch(setSelectedConnFLReset());

            var urls = nextProps.secondLevel.map(l => l.inner);
            dispatch(firstLevelLoader(urls, [], [], limit));
            dispatch(firstLevelCount(urls, [], []));
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getFirstLevelReset());
        dispatch(setSelectedTypeFLReset());
        dispatch(setSelectedConnFLReset());
    }

    load() {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, selectedTypeFL, selectedConnFL, limit} = this.props;

        var urls = secondLevel.map(l => l.inner);
        dispatch(firstLevelLoader(urls, [...selectedTypeFL], [...selectedConnFL], limit));
        dispatch(firstLevelCount(urls, [...selectedTypeFL], [...selectedConnFL]))
    }

    reset() {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, limit} = this.props;

        dispatch(setSelectedTypeFLReset());
        dispatch(setSelectedConnFLReset());

        var urls = secondLevel.map(l => l.inner);

        dispatch(firstLevelLoader(urls, [], [], limit));
        dispatch(firstLevelCount(urls, [], []));
    }

    render() {
        const {dispatch, status, firstLevel, selectedTypeFL, selectedConnFL} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading things in first level..."/>
        }

        else if (firstLevel.length == 0) {
            return <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
        }

        var buttonsEnabled = selectedTypeFL.size > 0 || selectedConnFL.size > 0;

        return <Paper>
            <RecordSelector
                records={firstLevel}
                header="Things Types:"
                getKey={t => t.outerType}
                getValue={t => t.outerType}
                selectedKeys={selectedTypeFL}
                onKeySelect={k => dispatch(setSelectTypeFL(k))}
            />
            <RecordSelector
                records={firstLevel}
                header="Connection Types:"
                getKey={t => t.connection}
                getValue={t => t.connection}
                selectedKeys={selectedConnFL}
                onKeySelect={k => dispatch(setSelectConnFL(k))}
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
            <CountFirstLevelContainer/>
        </Paper>
    }
}

const selector = createStructuredSelector({
    firstLevel: firstLevelSelector,
    secondLevel: secondLevelSelector,
    status: firstLevelStatusSelector,
    selectedTypeFL: selectedTypeFLSelector,
    selectedConnFL: selectedConnFLSelector,
    limit: limitSelector
});

export default connect(selector)(FirstLevelLoader);
