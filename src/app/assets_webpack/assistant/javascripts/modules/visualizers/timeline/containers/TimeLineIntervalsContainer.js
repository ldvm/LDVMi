import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getIntervals, getIntervalsReset, intervalsSelector, intervalsStatusSelector } from '../ducks/intervals'
import { firstLevelSelector } from '../ducks/firstLevel'
import { PromiseStatus } from '../../../core/models'
import {createStructuredSelector} from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import TimeLine from '../misc/TimeLine'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class TimeLineIntervalsContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Levels
        firstLevel: PropTypes.instanceOf(Array).isRequired,

        // Intervals loading
        intervals: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired

        // TODO limit
    };

    componentWillMount(){
        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, ()=>{}); // TODO: callback

        this.begin = new Date("2000-01-01");
        this.end = new Date("2018-01-01");

        this.props.dispatch(getIntervals([], this.start, this.end, 100))
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevel} = this.props;

        if (firstLevel != nextProps.firstLevel) {
            var urls = nextProps.firstLevel.map(t => t.inner);
            dispatch(getIntervals(urls, this.begin, this.end, 100));
        }
    }

    componentDidUpdate() {
        const { intervals, status } = this.props;
        if (status.done && intervals.length > 0) {
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
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading intervals..."/>
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
    status: intervalsStatusSelector,
    firstLevel: firstLevelSelector
});

export default connect(selector)(TimeLineIntervalsContainer);