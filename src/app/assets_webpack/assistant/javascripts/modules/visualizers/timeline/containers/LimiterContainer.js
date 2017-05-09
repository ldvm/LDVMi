import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getCountReset, countSelector, countStatusSelector } from '../ducks/count'
import { getLimitReset, setLimit, limitSelector, limit_default} from '../ducks/limit'
import { PromiseStatus } from '../../../core/models'
import { createStructuredSelector } from "reselect";

import PromiseResult from '../../../core/components/PromiseResult'
import CenteredMessage from '../../../../components/CenteredMessage'
import VisualizationMessage from '../components/VisualizationMessage'
import Button from "../../../../components/Button";

class LimiterContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,

        // Count Loaders
        count: PropTypes.instanceOf(Number).isRequired,
        status: PropTypes.instanceOf(PromiseStatus).isRequired,

        // Limit
        limit: PropTypes.instanceOf(Number).isRequired
    };

    componentWillUnmount() {
        const {dispatch} = this.props;

        dispatch(getCountReset());
        dispatch(getLimitReset());
    }

    setLimit() {
        const {dispatch} = this.props;

        var elements = document.getElementsByName("limit");
        if (elements.length > 0) {
            const value = parseInt(elements[0].value);
            dispatch(setLimit(value));
        }
    }

    resetLimit(){
        const {dispatch, limit} = this.props;
        dispatch(getLimitReset());

        var elements = document.getElementsByName("limit");
        if (elements.length > 0) {
            elements[0].value = limit_default;
        }
    };

    render() {
        const {status, count, limit} = this.props;

        var CountVisualizer;
        if (!status.done) {
            CountVisualizer =  <PromiseResult status={status} error={status.error} loadingMessage="Loading count..."/>
        }

        else {
            CountVisualizer = <VisualizationMessage>
                <CenteredMessage>Total {count} records were loaded. Try increasing the limit to load more.</CenteredMessage>
            </VisualizationMessage>
        }

        var resetEnabled = limit != limit_default;

        return <div>
            <table>
                <tr>
                    <th>LIMIT</th>
                    <th><input type="value"  name="limit" defaultValue={limit} onChange={()=>this.setLimit()}/></th>
                    <th><Button raised={resetEnabled}
                                 onTouchTap={()=>this.resetLimit()}
                                 disabled={!resetEnabled}
                                 label="RESET"
                    /></th>
                </tr>
            </table>
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
