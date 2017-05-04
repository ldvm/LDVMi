import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getInstants, getInstantsReset, instantsSelector, instantsStatusSelector } from '../ducks/instants'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import TimeLine from '../misc/TimeLine'
import {createStructuredSelector} from "reselect";
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class TimelineContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        instants: PropTypes.instanceOf(Array).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount(){
        const {dispatch} = this.props;
        dispatch(getInstants())
        this.className = 'timeseries-chart';
        this.chart = new TimeLine(this.className, ()=>{}) // TODO: callback
    }

    componentWillReceiveProps(nextProps){
        if (this.props.instants == null) return;

        const {instants} = nextProps;
        if (this.props.instants != instants) {
            this.chart.destroy();
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
            return <PromiseResult status={status} error={status.error} loadingMessage="Loading events..."/>
        }

        if (instants.length == 0) {
            return <VisualizationMessage>
                <CenteredMessage>No events were loaded. Check the settings please.</CenteredMessage>
            </VisualizationMessage>
        }

        require('../misc/TimeLineStyle.css');
        return <div className={this.className}/>
    }
}

const selector = createStructuredSelector({
    instants: instantsSelector,
    status: instantsStatusSelector
});

export default connect(selector)(TimelineContainer);