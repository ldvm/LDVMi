import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getSecondLevelReset, secondLevelSelector, secondLevelStatusSelector } from '../ducks/secondLevel'
import { setSelectThingSL, setUnSelectThingSL, getSelectedThingSLReset, selectedThingSLSelector } from '../ducks/selectedThingSecondLevel'
import { setSelectConnSL, setUnSelectConnSL, getSelectedConnSLReset, selectedConnSLSelector } from '../ducks/selectedConnSecondLevel'
import { PromiseStatus } from '../../../core/models'
import { createStructuredSelector } from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import ConfigToolbar from '../misc/ConfigToolbar'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

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
        selectedConnSL: PropTypes.instanceOf(Array).isRequired

        //TODO Limiter
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
        const{dispatch, secondLevelLoader, selectedThingSL, selectedConnSL} = this.props;
        dispatch(secondLevelLoader(selectedThingSL, [], selectedConnSL, 100));
    }

    reset(){
        const{dispatch, secondLevelLoader} = this.props;

        dispatch(getSelectedThingSLReset());
        dispatch(getSelectedConnSLReset());

        dispatch(secondLevelLoader([],[],[],100))
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

        return <div>
            <ConfigToolbar
                things={secondLevel}
                label={"THINGS"}
                getKey={t=>t.outer}
                getValue={t=>t.outer}
                selectedKeys={selectedThingSL}
                onChecked={k=>dispatch(setSelectThingSL(k))}
                onUnchecked={k=>dispatch(setUnSelectThingSL(k))}
            />
            <ConfigToolbar
                things={secondLevel}
                label={"CONNECTIONS"}
                getKey={t=>t.connection}
                getValue={t=>t.connection}
                selectedKeys={selectedConnSL}
                onChecked={k=>dispatch(setSelectConnSL(k))}
                onUnchecked={k=>dispatch(setUnSelectConnSL(k))}
            />
            <input type="button" name="load_second" value="LOAD" onClick={()=>this.load()}/>
            <input type="button" name="reset_second" value="RESET" onClick={()=>this.reset()}/>
        </div>
    }
}

const selector = createStructuredSelector({
    secondLevel: secondLevelSelector,
    status: secondLevelStatusSelector,
    selectedThingSL: selectedThingSLSelector,
    selectedConnSL: selectedConnSLSelector
});

export default connect(selector)(SecondLevelConnectionContainer);
