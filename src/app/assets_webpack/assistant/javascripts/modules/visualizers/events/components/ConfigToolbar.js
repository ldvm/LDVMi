import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {createStructuredSelector} from "reselect";
import {configurationSelector, getConfiguration} from '../ducks/configuration'
import { Configuration } from '../models'
import moment from "moment";

class ConfigToolbar extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        configuration: PropTypes.instanceOf(Configuration).isRequired,
    };

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getConfiguration());
    }
    //TODO: Update configuration.
    /*componentDidUpdate(){
        var configuration = this.props.configuration;
        configuration.start = document.getElementsByName("start")[0].value;
        configuration.end = document.getElementsByName("end")[0].value;
        configuration.limit = document.getElementsByName("limit")[0].value;
        dispatch()
    }*/

    render() {
        const {configuration} = this.props;

        var startString = moment(configuration.start).format('YYYY-MM-DD');
        var endString = moment(configuration.end).format('YYYY-MM-DD');
        return <div>
            <table>
                <tr>
                    <th>TimeSeries Start</th>
                    <th>TimeSeries End</th>
                    <th>Max event count</th>
                </tr>
                <tr>
                    <td>
                        <input type="date" name="start" value={startString}/>
                    </td>
                    <td>
                        <input type="date" name="end" value={endString}/>
                    </td>
                    <td>
                        <input type="value" name="limit" value={configuration.limit}/>
                    </td>
                    <td>
                        <input type="submit"/>
                    </td>
                </tr>
            </table>
        </div>
        }
}
const selector = createStructuredSelector({
    configuration: configurationSelector
});

export default connect(selector)(ConfigToolbar);