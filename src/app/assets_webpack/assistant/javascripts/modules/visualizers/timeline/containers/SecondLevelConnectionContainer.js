import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";

import {getSecondLevelReset, secondLevelSelector, secondLevelStatusSelector} from "../ducks/secondLevel";
import {limitSelector} from "../ducks/limit";
import {
    getSelectedThingSLReset,
    selectedThingSLSelector,
    setSelectThingSL,
    setUnSelectThingSL
} from "../ducks/selectedThingSecondLevel";
import {
    getSelectedConnSLReset,
    selectedConnSLSelector,
    setSelectConnSL,
    setUnSelectConnSL
} from "../ducks/selectedConnSecondLevel";
import {PromiseStatus} from "../../../core/models";
import {createStructuredSelector} from "reselect";

import PromiseResult from "../../../core/components/PromiseResult";
import ConfigToolbar from "../misc/ValueSelector";
import CenteredMessage from "../../../../components/CenteredMessage";
import Button from "../../../../components/Button";
import {AppBar, Paper} from "material-ui";
import CountSecondLevelContainer from "./CountSecondLevelContainer";

class SecondLevelConnectionContainer extends Component {
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
        selectedThingSL: PropTypes.instanceOf(Array).isRequired,
        selectedConnSL: PropTypes.instanceOf(Array).isRequired,

        limit: PropTypes.number.isRequired
    };

    componentWillMount() {
        if (this.props.isInitial) this.load();
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getSecondLevelReset());
        dispatch(getSelectedThingSLReset());
        dispatch(getSelectedConnSLReset());
    }

    load() {
        const {dispatch, secondLevelLoader, secondLevelCount, selectedThingSL, selectedConnSL, limit} = this.props;
        dispatch(secondLevelLoader(selectedThingSL, [], selectedConnSL, limit));
        dispatch(secondLevelCount(selectedThingSL, [], selectedConnSL));
    }

    reset() {
        const {dispatch, secondLevelLoader, secondLevelCount, limit} = this.props;

        dispatch(getSelectedThingSLReset());
        dispatch(getSelectedConnSLReset());

        dispatch(secondLevelLoader([], [], [], limit));
        dispatch(secondLevelCount([], [], []));
    }

    render() {
        const {dispatch, status, secondLevel, selectedThingSL, selectedConnSL} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading things in second level..."/>
        }

        else if (secondLevel.length == 0) {
            return <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
        }

        var buttonsEnabled = selectedThingSL.length > 0 || selectedConnSL.length > 0;

        return <Paper>
            <AppBar title="Second Level Connections"/>
            <ConfigToolbar
                things={secondLevel}
                header="Second Level Records:"
                getKey={t => t.outer}
                getValue={t => t.outer}
                selectedKeys={selectedThingSL}
                onChecked={k => dispatch(setSelectThingSL(k))}
                onUnchecked={k => dispatch(setUnSelectThingSL(k))}
            />
            <ConfigToolbar
                things={secondLevel}
                header="Connection Types:"
                getKey={t => t.connection}
                getValue={t => t.connection}
                selectedKeys={selectedConnSL}
                onChecked={k => dispatch(setSelectConnSL(k))}
                onUnchecked={k => dispatch(setUnSelectConnSL(k))}
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
            <CountSecondLevelContainer/>
        </Paper>
    }
}

const selector = createStructuredSelector({
    secondLevel: secondLevelSelector,
    status: secondLevelStatusSelector,
    selectedThingSL: selectedThingSLSelector,
    selectedConnSL: selectedConnSLSelector,
    limit: limitSelector
});

export default connect(selector)(SecondLevelConnectionContainer);
