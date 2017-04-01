import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {createStructuredSelector} from "reselect";
import { configSelector } from '../ducks/configuration'
import {getSelectedEvent, getSelectedEventReset, selectedEventSelector} from "../ducks/selectedEvent";
import TimelineContainer from '../containers/TimelineContainer'
import EventInfoContainer from '../containers/EventInfoContainer'
import {Configuration, SelectedEvent} from '../models'
import { getConfiguration, getConfigurationReset} from '../ducks/configuration'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class Visualization extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        selectedEvent: PropTypes.instanceOf(SelectedEvent).isRequired,
        configuration: PropTypes.instanceOf(Configuration).isRequired
    };

    componentWillMount(){
        const {dispatch} = this.props;
        dispatch(getSelectedEvent());
    }

    componentWillUpdate(){
        const { dispatch } = this.props;
        dispatch(getSelectedEvent());
        dispatch(getConfiguration());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(getSelectedEventReset());
        dispatch(getConfigurationReset());
    }

    render() {
        const {configuration, selectedEvent} = this.props;
        if(!configuration){
            return <VisualizationMessage>
                <CenteredMessage>An error occurred while loading the configuration.</CenteredMessage>
            </VisualizationMessage>
        }
        return <div>
            <TimelineContainer configuration={configuration}/>
            <EventInfoContainer selectedEvent={selectedEvent}/>
        </div>
    }
}
const selector = createStructuredSelector({
    configuration: configSelector,
    selectedEvent: selectedEventSelector
});

export default connect(selector)(Visualization);