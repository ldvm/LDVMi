import React, { Component, PropTypes } from 'react'
import timeline from '../misc/timeline'
import makePureRender from '../../../../misc/makePureRender'
import {getAvailableVerticalSpace} from "../../../../components/FillInScreen";
import {bodyPaddingSpace} from "../../../../components/BodyPadding";
import d3 from 'd3'

class Timeline extends Component {
    static propTypes = {
        data: PropTypes.instanceOf(Array).isRequired,
        start: PropTypes.number.isRequired,
        end: PropTypes.number.isRequired
    };

    componentDidMount(){
        this.chart = timeline();
        this.renderChart();
    }

    componentDidUpdate(){
        this.renderChart()
    }

    renderChart(){
        const size = Math.max(getAvailableVerticalSpace(this.refs.timeline) - bodyPaddingSpace, 450);

        this.chart
            .margin({left:70, right:30, top:0, bottom:0})
            .beginning(this.props.start)
            .ending(this.props.end);

        var svg = d3.select(this.refs.timeline)
            .append("svg")
            .attr("width", size)
            .attr("height", size/2)
            .datum(this.props.data)
            .call(this.chart);
    }

    render() {
        return <div ref="timeline"></div>
    }
}
export default makePureRender(Timeline);

