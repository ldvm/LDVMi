import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application as ApplicationModel } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import TimelineContainer from '../containers/TimelineContainer'

class Application extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(ApplicationModel).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired,
        embed: PropTypes.bool
    };

    render() {
        const { embed } = this.props;
        return (
            <BodyPadding>
                <p>{embed ? 'Embed' : 'Standalone'} mode.</p>
                <TimelineContainer/>
            </BodyPadding>
        )
    }
}

export default Application;