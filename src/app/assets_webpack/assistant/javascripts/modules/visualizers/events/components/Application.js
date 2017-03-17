import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application as ApplicationModel } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import { EventLoader } from '../containers/EventLoader'

class Application extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(ApplicationModel).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired,
        embed: PropTypes.bool
    };


    render() {
        const { application, visualizer, embed } = this.props;
        return (
            <BodyPadding>
                <p>This is the event visualizer application.</p>
                <p>It runs in {embed ? 'embed' : 'standalone'} mode</p>
                <p>{application.name}</p>
                <p>{visualizer.title}</p>
                <EventLoader />
            </BodyPadding>
        )
    }
}

export default Application;