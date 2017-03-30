import React, { Component, PropTypes } from 'react'
import TimeSeries from '../misc/TimeSeries'
import makePureRender from '../../../../misc/makePureRender'

class TimelineContainer extends Component {
    static propTypes = {
        data: PropTypes.instanceOf(Array).isRequired
    };

    componentDidMount(){
        var domEl = 'timeseries';
        var data = this.props.data;
        var chart = new TimeSeries(domEl,data,true);
    }

    render() {
        require('../misc/style.css');
        return <div className="timeseries"/>
    }
}
export default makePureRender(TimelineContainer);

