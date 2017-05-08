import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getCountReset, countSelector, countStatusSelector } from '../ducks/count'
import { getLimitReset, setLimit, limitSelector } from '../ducks/limit'
import { PromiseStatus } from '../../../core/models'
import {createStructuredSelector} from "reselect";
import {Count, Limit} from "../models";

import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'

class LimiterContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Count Loaders
        count: PropTypes.instanceOf(Count).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // Limit
        limit: PropTypes.instanceOf(Limit).isRequired
    };

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getCountReset());
        dispatch(getLimitReset());
    }

    render() {
        const {status, count, limit} = this.props;

        var CountVisualizer;
        if (!status.done) {
            CountVisualizer =  <PromiseResult status={status} error={status.error} loadingMessage="Loading count..."/>
        }

        else {
            CountVisualizer = <VisualizationMessage>
                <CenteredMessage>Total {count} records loaded.</CenteredMessage>
            </VisualizationMessage>
        }

        return <div>
            {CountVisualizer}
        </div>

    }
}

const selector = createStructuredSelector({
    count: countSelector,
    status: countStatusSelector,
    limit: limitSelector
});

export default connect(selector)(LimiterContainer);
