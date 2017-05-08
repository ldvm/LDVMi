import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getFirstLevelReset, firstLevelSelector, firstLevelStatusSelector } from '../ducks/firstLevel'
import { secondLevelSelector } from '../ducks/secondLevel'
import { setSelectTypeFL, setUnSelectTypeFL, getSelectedTypeFLReset, selectedTypeFLSelector } from '../ducks/selectedTypeFirstLevel'
import { setSelectConnFL, setUnSelectConnFL, getSelectedConnFLReset, selectedConnFLSelector } from '../ducks/selectedConnFirstLevel'
import { PromiseStatus } from '../../../core/models'
import { createStructuredSelector } from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import ConfigToolbar from '../misc/ConfigToolbar'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class FirstLevelConnectionContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Levels
        firstLevel: PropTypes.instanceOf(Array).isRequired,
        secondLevel: PropTypes.instanceOf(Array).isRequired,

        // Level loading
        firstLevelLoader: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // Value selectors
        selectedTypeFL: PropTypes.instanceOf(Array).isRequired,
        selectedConnFL: PropTypes.instanceOf(Array).isRequired

        //TODO Limiter
    };

    componentWillMount(){
        this.load();
    }

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getFirstLevelReset());
        dispatch(getSelectedTypeFLReset());
        dispatch(getSelectedConnFLReset());
    }

    load(){
        const{dispatch, firstLevelLoader, secondLevel, selectedTypeFL, selectedConnFL} = this.props;

        var urls = secondLevel.map(l=>l.inner);
        dispatch(firstLevelLoader(urls, selectedTypeFL, selectedConnFL, 100));
    }

    reset(){
        const{dispatch, firstLevelLoader, secondLevel} = this.props;

        dispatch(getSelectedTypeFLReset());
        dispatch(getSelectedConnFLReset());

        var urls = secondLevel.map(l=>l.inner);
        dispatch(firstLevelLoader(urls, [], [], 100))
    }

    render() {
        const {dispatch, status, firstLevel, selectedTypeFL, selectedConnFL} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading things in first level..."/>
        }

        else if (firstLevel.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
            </VisualizationMessage>
        }

        return <div>
            <ConfigToolbar
                things={firstLevel}
                label={"TYPES"}
                getKey={t=>t.outerType}
                getValue={t=>t.outerType}
                selectedKeys={selectedTypeFL}
                onChecked={k=>dispatch(setSelectTypeFL(k))}
                onUnchecked={k=>dispatch(setUnSelectTypeFL(k))}
            />
            <ConfigToolbar
                things={firstLevel}
                label={"CONNECTIONS"}
                getKey={t=>t.connection}
                getValue={t=>t.connection}
                selectedKeys={selectedConnFL}
                onChecked={k=>dispatch(setSelectConnFL(k))}
                onUnchecked={k=>dispatch(setUnSelectConnFL(k))}
            />
            <input type="button" name="load_first" value="LOAD" onClick={()=>this.load()}/>
            <input type="button" name="reset_first" value="RESET" onClick={()=>this.reset()}/>
        </div>
    }
}

const selector = createStructuredSelector({
    firstLevel: firstLevelSelector,
    secondLevel: secondLevelSelector,
    status: firstLevelStatusSelector,
    selectedTypeFL: selectedTypeFLSelector,
    selectedConnFL: selectedConnFLSelector
});

export default connect(selector)(FirstLevelConnectionContainer);
