import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEvent, getEventReset, eventSelector, eventStatusSelector } from '../ducks/event'
import { PromiseStatus } from '../../../core/models'
import { Event } from '../models'


class EventLoader extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        event: PropTypes.instanceOf(Event).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getEvent());
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventReset());
    }

    render() {
        const {event, status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} loadingMessage="Loading base event info..."/>
        }

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
    event: eventSelector,
    status: eventStatusSelector
});

export default connect(selector)(EventLoader);