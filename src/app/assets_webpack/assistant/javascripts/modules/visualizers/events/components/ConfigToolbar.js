import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {createStructuredSelector} from "reselect";
import {configSelector, getConfigurationReset, setConfiguration} from '../ducks/configuration'
import { Configuration } from '../models'
import moment from "moment";

class ConfigToolbar extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        configuration: PropTypes.instanceOf(Configuration).isRequired,
    };

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(setConfiguration(new Configuration()));
    }

    componentWillUnmount(){
        const {dispatch} = this.props;
        dispatch(getConfigurationReset())
    }

    handleNewConfig(){
        const {dispatch, configuration} = this.props;

        var start = document.getElementsByName("start")[0].value;
        var end = document.getElementsByName("end")[0].value;
        var limit = document.getElementsByName("limit")[0].value;
        var newConfig = {start:new Date(start), end:new Date(end), limit:limit};

        if (configuration != newConfig) {
            dispatch(setConfiguration(newConfig));
        }
    }

    render() {
        const {configuration} = this.props;

        var startString = moment(configuration.start).format('YYYY-MM-DD');
        var endString = moment(configuration.end).format('YYYY-MM-DD');
        return <div>
            <table>
                <thead>
                    <tr>
                        <th>TimeSeries Start</th>
                        <th>TimeSeries End</th>
                        <th>Max event count</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input type="date" name="start" defaultValue={startString} readOnly={false}/>
                        </td>
                        <td>
                            <input type="date" name="end" defaultValue={endString} readOnly={false}/>
                        </td>
                        <td>
                            <input type="value" name="limit" defaultValue={configuration.limit} readOnly={false}/>
                        </td>
                        <td>
                            <input type="submit" onClick={()=>this.handleNewConfig()}/>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    }
}
const selector = createStructuredSelector({
    configuration: configSelector
});

export default connect(selector)(ConfigToolbar);