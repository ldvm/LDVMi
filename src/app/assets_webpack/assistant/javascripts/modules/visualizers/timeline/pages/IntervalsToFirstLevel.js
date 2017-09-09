import React, { Component, PropTypes } from 'react'
import { getFirstLevelIntervalsCount } from '../ducks/count'
import BodyPadding from '../../../../components/BodyPadding'
import FirstLevelLoader from '../containers/FirstLevelLoader'
import LimiterContainer from '../../../app/containers/LimiterContainer'
import TimeLineIntervals from '../components/TimeLineIntervals'
import IntervalsLoader from '../containers/IntervalsLoader'
import { getFirstLevelIntervals } from '../ducks/firstLevel'
import IntervalInfoWindow from '../components/IntervalInfoWindow'
import { PromiseStatus } from '../../../core/models'
import { getConfiguration, getConfigurationStatusSelector } from '../ducks/configuration'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import PromiseResult from '../../../core/components/PromiseResult'
import Toolbar from '../components/Toolbar'

class IntervalsToFirstLevel extends Component {
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
      ['FIRST LEVEL',
        <FirstLevelLoader
          isInitial={true}
          firstLevelLoader={getFirstLevelIntervals}
          firstLevelCount={getFirstLevelIntervalsCount}
        />],
      ['TIME RANGE',
        <IntervalsLoader
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
        <TimeLineIntervals/>
        <hr/>
        <IntervalInfoWindow/>
      </BodyPadding>
    )
  }
}
const selector = createStructuredSelector({
  status: getConfigurationStatusSelector
});
export default connect(selector)(IntervalsToFirstLevel);