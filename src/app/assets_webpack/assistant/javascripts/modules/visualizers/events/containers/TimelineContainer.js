import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { selectEvent } from '../ducks/selectedEvent'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimeSeries from '../misc/TimeSeries'
import {createStructuredSelector} from "reselect";
import {Configuration} from "../models"

class TimelineContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        events: PropTypes.instanceOf(Array).isRequired,
        configuration: PropTypes.instanceOf(Configuration).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount(){
        const {dispatch, configuration} = this.props;

        this.className = 'timeseries-chart';
        this.callBack = (ev)=>dispatch(selectEvent(ev));

        dispatch(getEvents(configuration));
    }

    componentWillReceiveProps(nextProps){
        const {dispatch, configuration} = nextProps;

        if (this.props.configuration != configuration) {
            dispatch(getEvents(configuration));
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
        const {status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading events..."/>
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