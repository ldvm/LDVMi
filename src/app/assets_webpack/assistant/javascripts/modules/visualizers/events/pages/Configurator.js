import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import Visualization from '../components/Visualization'
import ConfigToolbar from '../components/ConfigToolbar'

class Configurator extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(Application).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired
    };

    render() {
        return (
            <BodyPadding>
                <ConfigToolbar/>
                <Visualization/>
            </BodyPadding>
        )
    }
}
export default Configurator;