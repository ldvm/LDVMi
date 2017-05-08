import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getInstants, getInstantsReset, instantsSelector, instantsStatusSelector } from '../ducks/instants'
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
        status: PropTypes.instanceOf(PromiseStatus).isRequired

        // TODO limit
    };

    componentWillMount(){
        this.className = "timeseries-chart";
        this.chart = new TimeLine(this.className, ()=>{}); // TODO: callback

        this.begin = new Date("2000-01-01");
        this.end = new Date("2018-01-01");

        this.props.dispatch(getInstants([], this.start, this.end, 100))
    }

    componentWillReceiveProps(nextProps) {
        const {dispatch, firstLevel} = this.props;

        if (firstLevel != nextProps.firstLevel) {
            var urls = nextProps.firstLevel.map(t => t.inner);
            dispatch(getInstants(urls, this.begin, this.end, 100));
        }
    }

    componentDidUpdate() {
        const { instants, status } = this.props;
        if (status.done && instants.length > 0) {
            this.chart.destroy();
            this.chart.instants(this.props.instants);
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
    firstLevel: firstLevelSelector
});

export default connect(selector)(TimeLineInstantsContainer);