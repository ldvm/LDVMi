import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect";
import CenteredMessage from "../../../../components/CenteredMessage";

import { selectedTimeRecordSelector } from '../ducks/selectedTimeRecord'

import Label from "../../../app/containers/Label";
import LevelsVisualizer from "./LevelsVisualizer";

class InstantVisualizer extends Component {
    static propTypes = {
        selectedTimeRecord: PropTypes.instanceOf(Array).isRequired
    };

    render() {
        const {selectedTimeRecord} = this.props;

        if (selectedTimeRecord.length == 0) {
            return <CenteredMessage>Select events on the Time Line to view them.</CenteredMessage>
        }

        var instant = selectedTimeRecord[0];
        return <div>
            <table>
                <tbody>
                <tr>
                    <td>Name: </td>
                    <td><Label uri={instant.url}/></td>
                </tr>
                <tr>
                    <td>Date:</td>
                    <td>{new Date(instant.date).toDateString()}</td>
                </tr>
                </tbody>
            </table>
            <LevelsVisualizer timeRecordUrl={instant.url}/>
        </div>
    }
}

const selector = createStructuredSelector({
    selectedTimeRecord: selectedTimeRecordSelector,
});

export default connect(selector)(InstantVisualizer);