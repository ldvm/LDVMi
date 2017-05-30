import React, {Component, PropTypes} from "react";
import {connect} from "react-redux";
import {createStructuredSelector} from "reselect";
import {PromiseStatus} from "../../../core/models";
import {thingsWithPlacesCountSelector, thingsWithPlacesCountStatusSelector} from "../ducks/counts";
import PromiseResult from "../../../core/components/PromiseResult";
import CenteredMessage from "../../../../components/CenteredMessage";
import {getDistinctCount} from "../../../common/arrayUtils";
import {thingsWithPlacesSelector, thingsWithPlacesStatusSelector} from "../ducks/thingsWithPlaces";

class CountThingsContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        things: PropTypes.array.isRequired,
        thingsStatus: PropTypes.instanceOf(PromiseStatus).isRequired,

        count: PropTypes.number.isRequired,
        countStatus: PropTypes.instanceOf(PromiseStatus).isRequired
    };

    render() {
        const {count, countStatus, things, thingsStatus} = this.props;

        if (!countStatus.done) {
            return <PromiseResult status={countStatus} error={countStatus.error}
                                  loadingMessage="Loading things count..."/>
        }

        if (!thingsStatus.done) {
            return <PromiseResult status={thingsStatus} error={thingsStatus.error}
                                  loadingMessage="Loading things ..."/>
        }

        var loaded = getDistinctCount(t => t.outer, things);
        return <CenteredMessage>
            Loaded {loaded} records out of {count} available. Increase limit to load more.
        </CenteredMessage>
    }
}

const selector = createStructuredSelector({
    things: thingsWithPlacesSelector,
    thingsStatus: thingsWithPlacesStatusSelector,

    count: thingsWithPlacesCountSelector,
    countStatus: thingsWithPlacesCountStatusSelector,
});

export default connect(selector)(CountThingsContainer);
