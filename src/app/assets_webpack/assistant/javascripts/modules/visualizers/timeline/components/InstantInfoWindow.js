import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import CenteredMessage from '../../../../components/CenteredMessage'
import { selectedTimeRecordSelector } from '../ducks/selectedTimeRecord'
import LevelsInfoWindow from './LevelsInfoWindow'
import makePureRender from '../../../../misc/makePureRender'
import ObjectInfo from '../../../app/containers/ObjectInfo'
import SubHeadLine from '../../../../components/Subheadline'

class InstantInfoWindow extends Component {
  static propTypes = {
    selectedTimeRecord: PropTypes.instanceOf(Array).isRequired
  };

  render() {
    const { selectedTimeRecord } = this.props;

    if (selectedTimeRecord.length == 0) {
      return <CenteredMessage>Select events on the Time Line to view them.</CenteredMessage>
    }

    var instant = selectedTimeRecord[0];

    return <div>
      <SubHeadLine title="Instant"/>
      <ObjectInfo header="Instant" url={instant.url}/>
      <br/>
      <b>Date-Time: </b>
      {new Date(instant.date).toUTCString()}
      <hr/>
      <LevelsInfoWindow timeRecordUrl={instant.url}/>
    </div>
  }
}

const selector = createStructuredSelector({
  selectedTimeRecord: selectedTimeRecordSelector,
});

export default connect(selector)(makePureRender(InstantInfoWindow));