import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {PromiseStatus} from "../../../core/models";
import {createStructuredSelector} from "reselect";

import {firstLevelSelector, firstLevelStatusSelector, getFirstLevelReset} from "../ducks/firstLevel";
import {secondLevelSelector} from "../ducks/secondLevel";
import {limitSelector} from "../ducks/limit";
import {
    getSelectedTypeFLReset,
    selectedTypeFLSelector,
    setSelectTypeFL,
    setUnSelectTypeFL
} from "../ducks/selectedTypeFirstLevel";
import {
    getSelectedConnFLReset,
    selectedConnFLSelector,
    setSelectConnFL,
    setUnSelectConnFL
} from "../ducks/selectedConnFirstLevel";

import PromiseResult from "../../../core/components/PromiseResult";
import ConfigToolbar from "../misc/ValueSelector";
import CenteredMessage from "../../../../components/CenteredMessage";
import Button from "../../../../components/Button";
import {AppBar, Paper} from "material-ui";
import CountFirstLevelContainer from "./CountFirstLevelContainer";


class FirstLevelConnectionContainer extends Component {
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
        selectedTypeFL: PropTypes.instanceOf(Array).isRequired,
        selectedConnFL: PropTypes.instanceOf(Array).isRequired,

        limit: PropTypes.number.isRequired
    };

    componentWillMount() {
        if (this.props.isInitial) this.load();
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, limit} = this.props;
        if (secondLevel != nextProps.secondLevel) {
            dispatch(getSelectedTypeFLReset());
            dispatch(getSelectedConnFLReset());

            var urls = nextProps.secondLevel.map(l => l.inner);
            dispatch(firstLevelLoader(urls, [], [], limit));
            dispatch(firstLevelCount(urls, [], []));
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getFirstLevelReset());
        dispatch(getSelectedTypeFLReset());
        dispatch(getSelectedConnFLReset());
    }

    load() {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, selectedTypeFL, selectedConnFL, limit} = this.props;

        var urls = secondLevel.map(l => l.inner);
        dispatch(firstLevelLoader(urls, selectedTypeFL, selectedConnFL, limit));
        dispatch(firstLevelCount(urls, selectedTypeFL, selectedConnFL))
    }

    reset() {
        const {dispatch, firstLevelLoader, firstLevelCount, secondLevel, limit} = this.props;

        dispatch(getSelectedTypeFLReset());
        dispatch(getSelectedConnFLReset());

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

        var buttonsEnabled = selectedTypeFL.length > 0 || selectedConnFL.length > 0;

        return <Paper>
            <AppBar title="First Level Connections"/>
            <ConfigToolbar
                things={firstLevel}
                header="First Level Records Types:"
                getKey={t => t.outerType}
                getValue={t => t.outerType}
                selectedKeys={selectedTypeFL}
                onChecked={k => dispatch(setSelectTypeFL(k))}
                onUnchecked={k => dispatch(setUnSelectTypeFL(k))}
            />
            <ConfigToolbar
                things={firstLevel}
                header="Connection Types:"
                getKey={t => t.connection}
                getValue={t => t.connection}
                selectedKeys={selectedConnFL}
                onChecked={k => dispatch(setSelectConnFL(k))}
                onUnchecked={k => dispatch(setUnSelectConnFL(k))}
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

export default connect(selector)(FirstLevelConnectionContainer);
