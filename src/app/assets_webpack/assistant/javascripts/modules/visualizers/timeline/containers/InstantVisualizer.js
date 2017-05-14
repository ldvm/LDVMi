import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect";
import CenteredMessage from "../../../../components/CenteredMessage";

import { selectedTimeRecordSelector } from '../ducks/selectedTimeRecord'

import Label from "../../../app/containers/Label";
import Comment from "../../../app/containers/Comment"
import LevelsVisualizer from "./LevelsVisualizer";
import makePureRender from "../../../../misc/makePureRender";

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
                    <td><b>Name: </b></td>
                    <td><Label uri={instant.url}/></td>
                </tr>
                <tr>
                    <td><b>Description: </b></td>
                    <td><Comment uri={instant.url}/></td>
                </tr>
                <tr>
                    <td><b>Date: </b></td>
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

export default connect(selector)(makePureRender(InstantVisualizer));