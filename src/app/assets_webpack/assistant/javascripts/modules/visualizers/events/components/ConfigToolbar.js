import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {createStructuredSelector} from "reselect";
import {settingsSelector, getSettingsReset, getSettings, setSettings} from '../ducks/settings'
import { Settings } from '../models'
import moment from "moment";
import {getSelectedEventReset} from "../ducks/selectedEvent";

class ConfigToolbar extends Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired,
        settings: PropTypes.instanceOf(Settings).isRequired,
    };

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getSettings());
    }

    componentWillReceiveProps(nextProps){
        const {settings} = nextProps;

        if (this.props.settings != settings) {
            var startString = moment(settings.start).format('YYYY-MM-DD');
            var endString = moment(settings.end).format('YYYY-MM-DD');

            document.getElementsByName("start")[0].value = startString;
            document.getElementsByName("end")[0].value = endString;
            document.getElementsByName("limit")[0].value = settings.limit;
        }
    }

    componentWillUnmount(){
        const {dispatch} = this.props;
        dispatch(getSettingsReset())
    }

    handleNewConfig(){
        const {dispatch, settings} = this.props;

        var start = document.getElementsByName("start")[0].value;
        var end = document.getElementsByName("end")[0].value;
        var limit = document.getElementsByName("limit")[0].value;
        var newSettings = {start:new Date(start), end:new Date(end), limit:limit};

        if (settings != newSettings) {
            dispatch(setSettings(newSettings));
            dispatch(getSelectedEventReset());
        }
    }

    render() {
        const settings = this.props.settings;

        var startString = moment(settings.start).format('YYYY-MM-DD');
        var endString = moment(settings.end).format('YYYY-MM-DD');

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
                        <input type="value" name="limit" defaultValue={settings.limit} readOnly={false}/>
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
    settings: settingsSelector
});

export default connect(selector)(ConfigToolbar);