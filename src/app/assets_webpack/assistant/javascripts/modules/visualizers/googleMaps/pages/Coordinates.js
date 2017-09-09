import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import LimiterContainer from '../../../app/containers/LimiterContainer'
import FillInScreen from '../../../../components/FillInScreen'
import CoordinatesLoader from '../containers/CoordinatesLoader'
import GoogleMapsMarkers from '../components/GoogleMapsMarkers'
import { getConfiguration, getConfigurationStatusSelector } from '../ducks/configuration'
import ToolbarV2 from '../components/ToolbarV2'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'

class Coordinates extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getConfiguration());
  }

  render() {
    const { status } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading configuration..."/>
    }

    let configurations = new Map([
      ['COORDINATES',
        <CoordinatesLoader isInitial={true}/>],
      ['LIMIT',
        <LimiterContainer/>]
    ]);

    var hidden = true;
    if (this.props.route.configurable) hidden = false;

    return (
      <BodyPadding>
        <ToolbarV2 configurations={configurations} hidden={hidden}/>
        <FillInScreen forceFill={true}>
          <GoogleMapsMarkers/>
        </FillInScreen>
      </BodyPadding>
    )
  }
}
const selector = createStructuredSelector({
  status: getConfigurationStatusSelector
});
export default connect(selector)(Coordinates);