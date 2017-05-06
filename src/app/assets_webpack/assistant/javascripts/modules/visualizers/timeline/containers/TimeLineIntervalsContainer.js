import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getIntervals, getIntervalsReset, intervalsSelector, intervalsStatusSelector } from '../ducks/intervals'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimeLine from '../misc/TimeLine'
import {createStructuredSelector} from "reselect";
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class TimeLineIntervalsContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        intervals: PropTypes.instanceOf(Array).isRequired,
        urls: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount(){
        const {dispatch} = this.props;
        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, ()=>{}) // TODO: callback
        dispatch(getIntervals()); // TODO: urls, settings.
    }

    componentDidUpdate() {
        const {intervals} = this.props;
        if (intervals.length > 0) {
            this.chart.destroy();
            this.chart.intervals(this.props.intervals);
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getIntervalsReset());
        this.chart.destroy();
    }

    render() {
        const {status, intervals} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading instants..."/>
        }

        else if (intervals.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No intervals were loaded. Check the settings please.</CenteredMessage>
            </VisualizationMessage>
        }

        require('../misc/TimeLineStyle.css');
        return <div className={this.className}/>
    }
}

const selector = createStructuredSelector({
    intervals: intervalsSelector,
    status: intervalsStatusSelector
});

export default connect(selector)(TimeLineIntervalsContainer);