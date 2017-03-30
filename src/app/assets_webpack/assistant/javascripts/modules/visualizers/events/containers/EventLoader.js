import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimelineContainer from './TimelineContainer'

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

    render() {
        const {events, status} = this.props;
        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading events..."/>
        }
        else if (!events || events.length == 0) {
            return <p>No events loaded - nothing to visualize.</p>
        }
        debugger;
        return <TimelineContainer data={events}/>
    }
}

const selector = createStructuredSelector({
    events: eventsSelector,
    status: eventsStatusSelector
});

export default connect(selector)(EventLoader);