import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {createStructuredSelector} from "reselect";
import { configSelector } from '../ducks/configuration'
import {selectedEventSelector} from "../ducks/selectedEvents";
import TimelineContainer from '../containers/TimelineContainer'
import EventInfoContainer from '../containers/EventInfoContainer'
import {Configuration, EventInfo} from '../models'
import { getConfiguration, getConfigurationReset} from '../ducks/configuration'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class Visualization extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        selectedEvent: PropTypes.instanceOf(EventInfo),
        configuration: PropTypes.instanceOf(Configuration).isRequired
    };

    componentWillUpdate(){
        const { dispatch } = this.props;
        dispatch(getConfiguration());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
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
            <EventInfoContainer eventInfo={selectedEvent}/>
        </div>
    }
}
const selector = createStructuredSelector({
    configuration: configSelector,
    selectedEvent: selectedEventSelector
});

export default connect(selector)(Visualization);