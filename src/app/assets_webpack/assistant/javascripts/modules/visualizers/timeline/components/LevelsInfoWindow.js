import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'

import { selectedTimeRecordSelector } from '../ducks/selectedTimeRecord'
import { firstLevelSelector } from '../ducks/firstLevel'
import { secondLevelSelector } from '../ducks/secondLevel'
import SubHeadLine from '../../../../components/Subheadline'
import ObjectInfo from '../../../app/containers/ObjectInfo'

class LevelsInfoWindow extends Component {
  static propTypes = {
    timeRecordUrl: PropTypes.string.isRequired,
    firstLevel: PropTypes.instanceOf(Array).isRequired,
    secondLevel: PropTypes.instanceOf(Array).isRequired
  };

  renderConnection(conn) {
    return <div key={conn.outer}>
      <ObjectInfo header="Thing" url={conn.outer}/>
      <br/>
      <ObjectInfo header="Type" url={conn.outerType}/>
      <br/>
      <ObjectInfo header="Predicate" url={conn.predicate}/>
      <hr/>
    </div>
  }

  render() {
    const { timeRecordUrl, firstLevel, secondLevel } = this.props;

    var matchingFirstLevel = [];
    for (let conn of firstLevel) {
      if (conn.inner == timeRecordUrl) matchingFirstLevel.push(conn)
    }

    var firstVis;
    if (matchingFirstLevel.length > 0) {
      firstVis = <div>
        <SubHeadLine title="Connected things (first level)"/>
        {matchingFirstLevel.map(m => this.renderConnection(m))}
      </div>
    }

    var matchingSecondLevel = [];
    for (let i of matchingFirstLevel) {
      for (let j of secondLevel) {
        if (i.outer == j.inner) matchingSecondLevel.push(j)
      }
    }
    var secondVis;
    if (matchingSecondLevel.length > 0) {
      secondVis = <div>
        <SubHeadLine title="Connected things (second level)"/>
        {matchingSecondLevel.map(m => this.renderConnection(m))}
      </div>
    }

    return <div>
      {firstVis}
      {secondVis}
    </div>

  }
}

const selector = createStructuredSelector({
  selectedTimeRecord: selectedTimeRecordSelector,
  firstLevel: firstLevelSelector,
  secondLevel: secondLevelSelector
});

export default connect(selector)(LevelsInfoWindow);
