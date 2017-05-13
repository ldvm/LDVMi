import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from "reselect";

import { selectedTimeRecordSelector } from '../ducks/selectedTimeRecord'
import { firstLevelSelector} from '../ducks/firstLevel'
import { secondLevelSelector } from '../ducks/secondLevel'

import Label from "../../../app/containers/Label";
import SubHeadLine from "../../../../components/Subheadline"

class LevelsVisualizer extends Component {
    static propTypes = {
        timeRecordUrl: PropTypes.string.isRequired,
        firstLevel: PropTypes.instanceOf(Array).isRequired,
        secondLevel: PropTypes.instanceOf(Array).isRequired
    };

    renderConnection(conn){
        return <div key={conn.outer}>
            <table>
                <tbody>
                <tr>
                    <td>Name: </td>
                    <td><Label uri={conn.outer}/></td>
                </tr>
                <tr>
                    <td>Type: </td>
                    <td><Label uri={conn.outerType}/></td>
                </tr>
                <tr>
                    <td>Connected by: </td>
                    <td><Label uri={conn.connection}/></td>
                </tr>
                <tr>
                    <td>Connected to: </td>
                    <td><Label uri={conn.inner}/></td>
                </tr>
                </tbody>
            </table>
        </div>
    }

    render() {
        const {timeRecordUrl, firstLevel, secondLevel} = this.props;

        var matchingFirstLevel = [];
        for (let conn of firstLevel) {
            if (conn.inner == timeRecordUrl) matchingFirstLevel.push(conn)
        }

        var firstVis;
        if (matchingFirstLevel.length > 0){
            firstVis = <div>
                <SubHeadLine title="Things connected to this instant/interval"/>
                {matchingFirstLevel.map(m=>this.renderConnection(m))}
            </div>
        }

        var matchingSecondLevel = [];
        for (let i of matchingFirstLevel){
            for (let j of secondLevel){
                if (i.outer == j.inner) matchingSecondLevel.push(j)
            }
        }
        var secondVis;
        if (matchingSecondLevel.length > 0){
            secondVis = <div>
                <SubHeadLine title="Things connected via 2 connections"/>
                {matchingSecondLevel.map(m=>this.renderConnection(m))}
            </div>
        }

        return <div>
            {firstVis}
            {secondVis}
        </div>

    }
}

const selector = createStructuredSelector({
    selectedTimeRecord: selectedTimeRecordSelector,
    firstLevel: firstLevelSelector,
    secondLevel: secondLevelSelector
});

export default connect(selector)(LevelsVisualizer);
