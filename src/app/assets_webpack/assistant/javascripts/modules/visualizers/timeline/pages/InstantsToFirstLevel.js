import React, {Component, PropTypes} from "react";
import {getFirstLevelInstants} from "../ducks/firstLevel";
import {getFirstLevelInstantsCount} from "../ducks/count";
import BodyPadding from "../../../../components/BodyPadding";
import FirstLevelLoader from "../containers/FirstLevelLoader";
import TimeLineInstants from "../components/TimeLineInstants";
import LimiterContainer from "../../../app/containers/LimiterContainer";
import InstantVisualizer from "../components/InstantVisualizer";
import InstantsLoader from "../containers/InstantsLoader";
import {PromiseStatus} from "../../../core/models";
import {getConfiguration, getConfigurationStatusSelector} from "../ducks/configuration";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import PromiseResult from "../../../core/components/PromiseResult";
import Toolbar from "../components/Toolbar";

class InstantsToFirstLevel extends Component {
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
            ["FIRST LEVEL",
                <FirstLevelLoader
                    isInitial={true}
                    firstLevelLoader={getFirstLevelInstants}
                    firstLevelCount={getFirstLevelInstantsCount}
                />],
            ["TIME RANGE",
                <InstantsLoader
                    isInitial={false}
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
                <TimeLineInstants/>
                <hr/>
                <InstantVisualizer/>
            </BodyPadding>
        )
    }
}
const selector = createStructuredSelector({
    status: getConfigurationStatusSelector
});
export default connect(selector)(InstantsToFirstLevel);