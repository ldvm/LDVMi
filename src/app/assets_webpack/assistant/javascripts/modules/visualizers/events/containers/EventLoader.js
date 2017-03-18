import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'

class EventLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        events: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getEvents());
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventsReset());
    }

    render() {
        const {events, status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} loadingMessage="Loading base events info..."/>
        }

        let event = events[0];
        return (
            <div>
                <p><strong>Graph info</strong></p>
                <p>Event info: {event.info }</p>
                <p>Event name: {event.name}</p>
                <p>Start : {event.start} </p>
                <p>End: {event.end} </p>
            </div>
        )
    }
}

const selector = createStructuredSelector({
    events: eventsSelector,
    status: eventsStatusSelector
});

export default connect(selector)(EventLoader);