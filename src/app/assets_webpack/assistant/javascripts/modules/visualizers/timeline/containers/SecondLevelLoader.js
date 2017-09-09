import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { getSecondLevelReset, secondLevelSelector, secondLevelStatusSelector } from '../ducks/secondLevel'
import { limitSelector } from '../../../app/ducks/limit'
import { selectedSecondLevelThingsSelector, setSelectedSecondLevelThingsReset, setSelectThingSL } from '../ducks/selectedSecondLevelThings'
import { selectedSecondLevelPredicatesSelector, setSelectedSecondLevelPredicatesReset, setSelectSecondLevelPredicate } from '../ducks/selectedSecondLevelPredicates'
import { PromiseStatus } from '../../../core/models'
import { createStructuredSelector } from 'reselect'
import PromiseResult from '../../../core/components/PromiseResult'
import RecordSelector from '../../../common/components/RecordSelector'
import CenteredMessage from '../../../../components/CenteredMessage'
import Button from '../../../../components/Button'
import { Paper } from 'material-ui'
import CountSecondLevelContainer from './CountSecondLevelContainer'
import { Set as ImmutableSet } from 'immutable'

class SecondLevelLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isInitial: PropTypes.bool,

    // Levels
    secondLevel: PropTypes.instanceOf(Array).isRequired,

    // Level loading
    secondLevelLoader: PropTypes.func.isRequired,
    secondLevelCount: PropTypes.func.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // Configurations selectors
    selectedSecondLevelThings: PropTypes.instanceOf(ImmutableSet).isRequired,
    selectedSecondLevelPredicates: PropTypes.instanceOf(ImmutableSet).isRequired,

    limit: PropTypes.number.isRequired
  };

  componentWillMount() {
    // Load data only if this loader is initial (responsible for the first load)
    if (this.props.isInitial) {
      this.load();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(getSecondLevelReset());
    dispatch(setSelectedSecondLevelThingsReset());
    dispatch(setSelectedSecondLevelPredicatesReset());
  }

  load() {
    const { dispatch, secondLevelLoader, secondLevelCount, selectedSecondLevelThings, selectedSecondLevelPredicates, limit } = this.props;
    dispatch(secondLevelLoader([...selectedSecondLevelThings], [], [...selectedSecondLevelPredicates], limit));
    dispatch(secondLevelCount([...selectedSecondLevelThings], [], [...selectedSecondLevelPredicates]));
  }

  reset() {
    const { dispatch, secondLevelLoader, secondLevelCount, limit } = this.props;

    dispatch(setSelectedSecondLevelThingsReset());
    dispatch(setSelectedSecondLevelPredicatesReset());

    dispatch(secondLevelLoader([], [], [], limit));
    dispatch(secondLevelCount([], [], []));
  }

  render() {
    const { dispatch, status, secondLevel, selectedSecondLevelThings, selectedSecondLevelPredicates } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading things in second level..."/>
    }

    else if (secondLevel.length == 0) {
      return <div>
        <CenteredMessage>No connected things were loaded. Check the settings please.</CenteredMessage>
        <Button raised={true}
                onTouchTap={() => this.reset()}
                disabled={false}
                label="RESET"
        />
      </div>
    }

    var buttonsEnabled = selectedSecondLevelThings.size > 0 || selectedSecondLevelPredicates.size > 0;

    return <Paper>
      <RecordSelector
        records={secondLevel}
        header="Things:"
        getKey={t => t.outer}
        selectedKeys={selectedSecondLevelThings}
        onKeySelect={k => dispatch(setSelectThingSL(k))}
      />
      <RecordSelector
        records={secondLevel}
        header="Properties:"
        getKey={t => t.predicate}
        selectedKeys={selectedSecondLevelPredicates}
        onKeySelect={k => dispatch(setSelectSecondLevelPredicate(k))}
      />
      <Button raised={true}
              primary={true}
              onTouchTap={() => this.load()}
              disabled={!buttonsEnabled}
              label="LOAD"
      />
      <Button raised={true}
              onTouchTap={() => this.reset()}
              disabled={false}
              label="RESET"
      />
      <CountSecondLevelContainer/>
    </Paper>
  }
}

const selector = createStructuredSelector({
  secondLevel: secondLevelSelector,
  status: secondLevelStatusSelector,

  selectedSecondLevelThings: selectedSecondLevelThingsSelector,
  selectedSecondLevelPredicates: selectedSecondLevelPredicatesSelector,

  limit: limitSelector
});

export default connect(selector)(SecondLevelLoader);
