import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getEvents, getEventsReset, eventsSelector, eventsStatusSelector } from '../ducks/events'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimeSeries from '../misc/TimeSeries'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'
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
        dispatch(getEvents(configuration.start,configuration.end,configuration.limit));
    }

    componentDidUpdate(){
        const {events} = this.props;
        var elements = document.getElementsByClassName(this.className);
        if (elements.length > 0) {
            if (this.chart != null) {
                this.chart.redraw();
            }
            else {
                this.chart = new TimeSeries(this.className, events, true);
            }
        }
    }
    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getEventsReset());
    }
    render() {
        const {events, status} = this.props;
        require('../misc/TimeSeriesStyle.css');

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading events..."/>
        }

        if (!events || events.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No events were loaded. Check the configuration.</CenteredMessage>
            </VisualizationMessage>
        }
        return <div className={this.className}/>
    }
}
const selector = createStructuredSelector({
    events: eventsSelector,
    status: eventsStatusSelector
});
export default connect(selector)(TimelineContainer);