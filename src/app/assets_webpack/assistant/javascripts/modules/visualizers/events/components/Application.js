import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application as ApplicationModel } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import EventLoader from '../containers/EventLoader'
import SaveButton from '../components/SaveButton'
import { getConfiguration, getConfigurationReset } from '../ducks/configuration'


class Application extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(ApplicationModel).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired,
        embed: PropTypes.bool
    };

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getConfiguration());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(getConfigurationReset());
    }

    render() {
        const { application, visualizer, embed } = this.props;
        return (
            <BodyPadding>
                <p>This is the {visualizer.name} in {application.name} in {embed ? 'embed' : 'standalone'} mode.</p>
                <EventLoader/>
                <SaveButton/>
            </BodyPadding>
        )
    }
}

export default Application;