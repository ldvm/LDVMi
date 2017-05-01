import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {createStructuredSelector} from "reselect";
import { settingsSelector } from '../ducks/settings'
import {getSelectedEvent, getSelectedEventReset, selectedEventSelector} from "../ducks/selectedEvent";
import TimelineContainer from '../containers/TimelineContainer'
import EventInfoContainer from '../containers/InfoContainer'
import {Settings, SelectedEvent} from '../models'
import { getSettings, getSettingsReset} from '../ducks/settings'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class Visualization extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        selectedEvent: PropTypes.instanceOf(SelectedEvent).isRequired,
        settings: PropTypes.instanceOf(Settings).isRequired
    };

    componentWillUpdate(){
        const { dispatch } = this.props;
        dispatch(getSelected());
        dispatch(getSettings());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(getSelected());
        dispatch(getSettingsReset());
    }

    render() {
        const {settings, selectedEvent} = this.props;
        if(!settings){
            return <VisualizationMessage>
                <CenteredMessage>An error occurred while loading the configuration.</CenteredMessage>
            </VisualizationMessage>
        }
        return <div>
            <TimelineContainer settings={settings}/>
            <EventInfoContainer selectedEvent={selectedEvent}/>
        </div>
    }
}
const selector = createStructuredSelector({
    settings: settingsSelector,
    selectedEvent: selectedEventSelector
});

export default connect(selector)(Visualization);