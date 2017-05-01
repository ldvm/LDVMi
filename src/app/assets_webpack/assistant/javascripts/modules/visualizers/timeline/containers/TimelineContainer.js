import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { selectEvent } from '../ducks/selectedEvent'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimeSeries from '../misc/TimeSeries'
import {createStructuredSelector} from "reselect";
import {Settings} from "../models"
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class TimelineContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        events: PropTypes.instanceOf(Array).isRequired,
        settings: PropTypes.instanceOf(Settings).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount(){
        const {dispatch} = this.props;

        this.className = 'timeseries-chart';
        this.callBack = (ev)=>dispatch(selectEvent(ev));
    }

    componentWillReceiveProps(nextProps){
        const {dispatch, settings} = nextProps;

        if (this.props.settings != settings) {
            dispatch(getEvents(settings));
        }
    }

    componentDidUpdate(){
        const {events, status} = this.props;

        if (this.chart && this.chart.exists(this.className)) {
            this.chart.destroy(this.className)
        }

        if (status.done) {
            this.chart = new TimeSeries(this.className, events, false, this.callBack);
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventsReset());
    }

    render() {
        const {status, events} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading events..."/>
        }

        if (events.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No events were loaded. Check the settings please.</CenteredMessage>
            </VisualizationMessage>
        }

        require('../misc/TimeSeriesStyle.css');
        return <div className={this.className}/>
    }
}

const selector = createStructuredSelector({
    events: eventsSelector,
    status: eventsStatusSelector
});

export default connect(selector)(TimelineContainer);