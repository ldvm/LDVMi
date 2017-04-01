import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application as ApplicationModel } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import Visualization from '../components/Visualization'
import SaveButton from '../components/SaveButton'
import { getConfiguration, getConfigurationReset } from '../ducks/configuration'
import ConfigToolbar from "./ConfigToolbar";

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
        const { embed } = this.props;
        return (
            <BodyPadding>
                <p>{embed ? 'Embed' : 'Standalone'} mode.</p>
                <ConfigToolbar/>
                <Visualization/>
            </BodyPadding>
        )
    }
}

export default Application;