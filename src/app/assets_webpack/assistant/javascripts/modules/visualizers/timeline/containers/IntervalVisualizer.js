import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect";
import CenteredMessage from "../../../../components/CenteredMessage";

import { selectedTimeRecordSelector } from '../ducks/selectedTimeRecord'

import Label from "../../../app/containers/Label";
import LevelsVisualizer from "./LevelsVisualizer";
import Comment from "../../../app/containers/Comment";

class IntervalVisualizer extends Component {
    static propTypes = {
        selectedTimeRecord: PropTypes.instanceOf(Array).isRequired
    };

    render() {
        const {selectedTimeRecord} = this.props;

        if (selectedTimeRecord.length == 0) {
            return <CenteredMessage>Select events on the Time Line to view them.</CenteredMessage>
        }

        var interval = selectedTimeRecord[0];
        return <div>
            <table>
                <tbody>
                <tr>
                    <td><b>Name: </b></td>
                    <td><Label uri={interval.url}/></td>
                </tr>
                <tr>
                    <td><b>Description: </b></td>
                    <td><Comment uri={interval.url}/></td>
                </tr>
                <tr>
                    <td><b>Begin: </b></td>
                    <td>{new Date(interval.begin).toDateString()}</td>
                </tr>
                <tr>
                    <td><b>End: </b></td>
                    <td>{new Date(interval.end).toDateString()}</td>
                </tr>
                </tbody>
            </table>
            <LevelsVisualizer timeRecordUrl={interval.url}/>
        </div>

    }
}

const selector = createStructuredSelector({
    selectedTimeRecord: selectedTimeRecordSelector,
});

export default connect(selector)(IntervalVisualizer);
