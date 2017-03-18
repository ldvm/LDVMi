import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import EventLoader from '../containers/EventLoader'
import { getConfiguration, getConfigurationReset } from '../ducks/configuration'


class Configurator extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(Application).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired
    };

    render() {
        const { application, visualizer } = this.props;
        return (
            <BodyPadding>
                <p>This is the graph visualizer configurator.</p>
                <p>{application.name}</p>
                <p>{visualizer.title}</p>
            <EventLoader/>
            </BodyPadding>
        )
    }

    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getConfiguration());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(getConfigurationReset());
    }
}

export default Configurator;