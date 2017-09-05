import React, { Component, PropTypes } from 'react'
import { getFirstLevelInstants } from '../ducks/firstLevel'
import { getFirstLevelInstantsCount, getSecondLevelInstantsCount } from '../ducks/count'
import { getSecondLevelInstants } from '../ducks/secondLevel'
import BodyPadding from '../../../../components/BodyPadding'
import SecondLevelLoader from '../containers/SecondLevelLoader'
import FirstLevelLoader from '../containers/FirstLevelLoader'
import TimeLineInstants from '../components/TimeLineInstants'
import LimiterContainer from '../../../app/containers/LimiterContainer'
import InstantInfoWindow from '../components/InstantInfoWindow'
import InstantsLoader from '../containers/InstantsLoader'
import { PromiseStatus } from '../../../core/models'
import { getConfiguration, getConfigurationStatusSelector } from '../ducks/configuration'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PromiseResult from '../../../core/components/PromiseResult'
import Toolbar from '../components/Toolbar'

class InstantsToSecondLevel extends Component {
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

    // Specify which loaders are in the configuration toolbar
    let configurations = new Map([
      ['SECOND LEVEL',
        <SecondLevelLoader
          isInitial={true}
          secondLevelLoader={getSecondLevelInstants}
          secondLevelCount={getSecondLevelInstantsCount}
        />],
      ['FIRST LEVEL',
        <FirstLevelLoader
          isInitial={false}
          firstLevelLoader={getFirstLevelInstants}
          firstLevelCount={getFirstLevelInstantsCount}
        />],
      ['TIME RANGE',
        <InstantsLoader
          isInitial={false}
        />],
      ['LIMIT',
        <LimiterContainer/>]

    ]);

    // Configuration toolbar is visible only in configurator UI, not in the application one.
    var hidden = true;
    if (this.props.route.configurable) hidden = false;

    return (
      <BodyPadding>
        <Toolbar configurations={configurations} hidden={hidden}/>
        <hr/>
        <TimeLineInstants/>
        <hr/>
        <InstantInfoWindow/>
      </BodyPadding>
    )
  }
}
const selector = createStructuredSelector({
  status: getConfigurationStatusSelector
});
export default connect(selector)(InstantsToSecondLevel);