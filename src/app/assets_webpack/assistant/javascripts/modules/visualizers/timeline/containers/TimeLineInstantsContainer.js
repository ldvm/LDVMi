import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getInstants, getInstantsReset, instantsSelector, instantsStatusSelector } from '../ducks/instants'
import { limitSelector } from '../ducks/limit'
import { firstLevelSelector } from '../ducks/firstLevel'
import { PromiseStatus } from '../../../core/models'
import {createStructuredSelector} from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import TimeLine from '../misc/TimeLine'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class TimeLineInstantsContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Levels
        firstLevel: PropTypes.instanceOf(Array).isRequired,

        // Instants loading
        instants: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        limit: PropTypes.instanceOf(Number).isRequired
    };

    componentWillMount(){
        const {dispatch, limit} = this.props;

        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, ()=>{}); // TODO: callback

        this.begin = new Date("2000-01-01");
        this.end = new Date("2018-01-01");

        dispatch(getInstants([], this.start, this.end, limit));
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevel, limit} = this.props;

        if (firstLevel != nextProps.firstLevel) {
            var urls = nextProps.firstLevel.map(t => t.inner);
            dispatch(getInstants(urls, this.begin, this.end, limit));
        }

        if (nextProps.status.done && nextProps.instants != this.props.instants) {
            this.needChartUpdate = true;
        }
    }

    componentDidUpdate() {
        const { instants } = this.props;
        if (this.needChartUpdate) {
            this.chart.instants(instants);
        }
    }

    componentWillUnmount() {
        const {dispatch} = this.props;
        dispatch(getInstantsReset());
        this.chart.destroy();
    }

    render() {
        const {status, instants} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading instants..."/>
        }

        else if (instants.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No instants were loaded. Check the settings please.</CenteredMessage>
            </VisualizationMessage>
        }

        require('../misc/TimeLineStyle.css');
        return <div className={this.className}/>
    }
}

const selector = createStructuredSelector({
    instants: instantsSelector,
    status: instantsStatusSelector,
    firstLevel: firstLevelSelector,
    limit: limitSelector
});

export default connect(selector)(TimeLineInstantsContainer);