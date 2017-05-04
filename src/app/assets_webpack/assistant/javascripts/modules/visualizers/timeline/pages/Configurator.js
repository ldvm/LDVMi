import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'
import TimelineContainer from '../containers/TimelineContainer'

class Configurator extends Component {
    static propTypes = {
        application: PropTypes.instanceOf(Application).isRequired,
        visualizer: PropTypes.instanceOf(Visualizer).isRequired
    };

   /* componentWillMount() {
        const { dispatch } = this.props;
        dispatch(getConfiguration());
    }

    componentWillUnmount() {
        const { dispatch } = this.props;
        dispatch(getConfigurationReset());
    }*/

    render() {
        return (
            <BodyPadding><TimelineContainer/></BodyPadding>
        )
        /*return (
            <BodyPadding>
                <Visualization/>
            </BodyPadding>
        )*/
    }
}
export default Configurator;