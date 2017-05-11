import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getCountReset, countZeroSelector, countZeroStatusSelector} from '../ducks/count'
import { intervalsSelector, intervalsStatusSelector} from '../ducks/intervals'
import { instantsSelector, instantsStatusSelector} from '../ducks/instants'
import { createStructuredSelector } from "reselect";
import { PromiseStatus } from "../../../core/models";

import PromiseResult from "../../../core/components/PromiseResult";
import CenteredMessage from "../../../../components/CenteredMessage";

class CountZeroLevelContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        count: PropTypes.instanceOf(Number).isRequired,
        countStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

        intervals: PropTypes.instanceOf(Array).isRequired,
        intervalsStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

        instants: PropTypes.instanceOf(Array).isRequired,
        instantsStatus: PropTypes.instanceOf(PromiseStatus).isRequired

    };

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getCountReset());
    }

    render() {
        const {count, countStatus, instants, instantsStatus, intervals, intervalsStatus} = this.props;

        if (!countStatus.done) {
            return <PromiseResult status={countStatus} error={countStatus.error} loadingMessage="Loading count..."/>
        }

        if (!instantsStatus.done && !intervalsStatus.done){
            return <PromiseResult status={countStatus} error={countStatus.error} loadingMessage="Loading instants..."/>
        }

        let loaded;
        if (instantsStatus.done) loaded = instants.length;
        if (intervalsStatus.done) loaded = intervals.length;

        return <CenteredMessage>
            Loaded {loaded} records out of {count} available. Increase limit to load more.
        </CenteredMessage>
    }
}

const selector = createStructuredSelector({
    count: countZeroSelector,
    countStatus: countZeroStatusSelector,

    instants: instantsSelector,
    instantsStatus: instantsStatusSelector,

    intervals: intervalsSelector,
    intervalsStatus: intervalsStatusSelector
});

export default connect(selector)(CountZeroLevelContainer);
