import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimelineChart from 'd3-timeline-chart'

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

        const element = document.getElementById("chart_placeholder");
        const data = [{
            label: 'Name',
            data: [ {
                label: 'I\'m a label',
                type: TimelineChart.TYPE.INTERVAL,
                from: new Date([2015, 2, 1]),
                to: new Date([2015, 3, 1])
            }]
        }, { label: 'Event', data: {
                label: 'I\'m a label II',
                type: TimelineChart.TYPE.INTERVAL,
                from: new Date([2015, 2, 20]),
                to: new Date([2015, 3, 20])
            }
        }];

        var chart = new TimelineChart(element, data, {
            tip: function(d) {
                return d.at || `${d.from}<br>${d.to}`;
            },
            width: 1000,
            height: 1000
        });

        return <div/>;
    }
}

const selector = createStructuredSelector({
    events: eventsSelector,
    status: eventsStatusSelector
});

export default connect(selector)(EventLoader);