import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getSecondLevelReset, secondLevelSelector, secondLevelStatusSelector } from '../ducks/secondLevel'
import { limitSelector } from '../ducks/limit'
import { setSelectThingSL, setUnSelectThingSL, getSelectedThingSLReset, selectedThingSLSelector } from '../ducks/selectedThingSecondLevel'
import { setSelectConnSL, setUnSelectConnSL, getSelectedConnSLReset, selectedConnSLSelector } from '../ducks/selectedConnSecondLevel'
import { PromiseStatus } from '../../../core/models'
import { createStructuredSelector } from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import ConfigToolbar from '../misc/ConfigToolbar'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'
import Button from "../../../../components/Button";

class SecondLevelConnectionContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Levels
        secondLevel: PropTypes.instanceOf(Array).isRequired,

        // Level loading
        secondLevelLoader: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // Value selectors
        selectedThingSL: PropTypes.instanceOf(Array).isRequired,
        selectedConnSL: PropTypes.instanceOf(Array).isRequired,

        limit: PropTypes.instanceOf(Number).isRequired
    };

    componentWillMount(){
        this.load();
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getSecondLevelReset());
        dispatch(getSelectedThingSLReset());
        dispatch(getSelectedConnSLReset());
    }

    load(){
        const{dispatch, secondLevelLoader, selectedThingSL, selectedConnSL, limit} = this.props;
        dispatch(secondLevelLoader(selectedThingSL, [], selectedConnSL, limit));
    }

    reset(){
        const{dispatch, secondLevelLoader, limit} = this.props;

        dispatch(getSelectedThingSLReset());
        dispatch(getSelectedConnSLReset());

        dispatch(secondLevelLoader([],[],[],limit))
    }

    render() {
        const {dispatch, status, secondLevel, selectedThingSL, selectedConnSL} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading things in second level..."/>
        }

        else if (secondLevel.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
            </VisualizationMessage>
        }

        var buttonsEnabled = selectedThingSL.length > 0 || selectedConnSL.length > 0;

        return <div>
            <ConfigToolbar
                things={secondLevel}
                header="Things With Things With Time Values:"
                getKey={t=>t.outer}
                getValue={t=>t.outer}
                selectedKeys={selectedThingSL}
                onChecked={k=>dispatch(setSelectThingSL(k))}
                onUnchecked={k=>dispatch(setUnSelectThingSL(k))}
            />
            <ConfigToolbar
                things={secondLevel}
                header="Connection Types:"
                getKey={t=>t.connection}
                getValue={t=>t.connection}
                selectedKeys={selectedConnSL}
                onChecked={k=>dispatch(setSelectConnSL(k))}
                onUnchecked={k=>dispatch(setUnSelectConnSL(k))}
            />
            <Button raised={false}
                    onTouchTap={()=>this.load()}
                    disabled={!buttonsEnabled}
                    label="LOAD"
            />
            <Button raised={false}
                    onTouchTap={()=>this.reset()}
                    disabled={!buttonsEnabled}
                    label="RESET"
            />
        </div>
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
