import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import Visualization from '../components/Visualization'
import ConfigToolbar from '../components/ConfigToolbar'
import SaveButton from '../containers/SaveButton'
import {getConfiguration, getConfigurationReset} from "../ducks/configuration";

class Configurator extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(Application).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired
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
        return (
            <BodyPadding>
                <ConfigToolbar/>
                <Visualization/>
                <SaveButton/>
            </BodyPadding>
        )
    }
}
export default Configurator;