import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getLimitReset, setLimit, limitSelector, limit_default} from '../ducks/limit'
import { createStructuredSelector } from "reselect";
import Button from "../../../../components/Button";

class LimiterContainer extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        limit: PropTypes.instanceOf(Number).isRequired
    };

    componentWillUnmount() {
        const {dispatch} = this.props;

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
        const {limit} = this.props;

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
        </div>

    }
}

const selector = createStructuredSelector({
    limit: limitSelector
});

export default connect(selector)(LimiterContainer);
