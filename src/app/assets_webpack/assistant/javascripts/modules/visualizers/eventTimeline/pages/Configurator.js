import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'

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
            </BodyPadding>
        )
    }
}

export default Configurator;