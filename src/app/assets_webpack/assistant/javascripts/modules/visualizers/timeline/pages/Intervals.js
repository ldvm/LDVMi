import React, {Component, PropTypes} from "react";
import BodyPadding from "../../../../components/BodyPadding";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import TimeLineIntervals from "../components/TimeLineIntervals";
import IntervalsLoader from "../containers/IntervalsLoader";
import IntervalVisualizer from "../components/IntervalVisualizer";
import {PromiseStatus} from "../../../core/models";
import {getConfiguration, getConfigurationStatusSelector} from "../ducks/configuration";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import PromiseResult from "../../../core/components/PromiseResult";
import Toolbar from "../components/Toolbar";

class Intervals extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(getConfiguration());
    }

    render() {
        const {status} = this.props;

        if (!status.done) {
            return <PromiseResult status={status} error={status.error}
                                  loadingMessage="Loading configuration..."/>
        }

        let configurations = new Map([
            ["TIME RANGE",
                <IntervalsLoader
                    isInitial={true}
                />],
            ["LIMIT",
                <LimiterContainer/>]

        ]);

        var hidden = true;
        if (this.props.route.configurable) hidden = false;

        return (
            <BodyPadding>
                <Toolbar configurations={configurations} hidden={hidden}/>
                <hr/>
                <TimeLineIntervals/>
                <hr/>
                <IntervalVisualizer/>
            </BodyPadding>
        )
    }
}
const selector = createStructuredSelector({
    status: getConfigurationStatusSelector
});
export default connect(selector)(Intervals);