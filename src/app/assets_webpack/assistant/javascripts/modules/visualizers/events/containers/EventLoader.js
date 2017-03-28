import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import Timeline from '../components/Timeline'

class EventLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        events: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getEvents((new Date("1900-01-01")),(new Date("2017-01-01")),20));
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventsReset());
    }

    getChartFormat(eventInfo) {
        var start = parseInt(eventInfo.start);
        var end = parseInt(eventInfo.end);
        var data = {
            class: eventInfo.url,
            label: eventInfo.name,
            times: [{
                starting_time: start,
                ending_time: end}]
            };
        return data;
    }

    render() {
        const {events, status} = this.props;
        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading events..."/>
        }
        else if (!events || events.length == 0) {
            return <p>No events loaded - nothing to visualize.</p>
        }
        var data = events.map(this.getChartFormat);
        var start = Math.min(data.map(d=>d.times.starting_time));
        var end = Math.max(data.map(d=>d.times.ending_time));
        return <Timeline data={data} start={start} end={end}/>
    }
}

const selector = createStructuredSelector({
    events: eventsSelector,
    status: eventsStatusSelector
});

export default connect(selector)(EventLoader);