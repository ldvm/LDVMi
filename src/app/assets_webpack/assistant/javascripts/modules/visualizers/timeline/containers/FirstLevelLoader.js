import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { PromiseStatus } from '../../../core/models'
import { createStructuredSelector } from 'reselect'
import { firstLevelSelector, firstLevelStatusSelector, getFirstLevelReset } from '../ducks/firstLevel'
import { secondLevelSelector } from '../ducks/secondLevel'
import { limitSelector } from '../../../app/ducks/limit'
import { selectedFirstLevelTypesSelector, setSelectedFirstLevelTypesReset, setSelectFirstLevelType } from '../ducks/selectedFirstLevelTypes'
import { selectedFirstLevelPredicatesSelector, setSelectedFirstLevelPredicatesReset, setSelectFirstLevelPredicate } from '../ducks/selectedFirstLevelPredicates'
import PromiseResult from '../../../core/components/PromiseResult'
import RecordSelector from '../../../common/components/RecordSelector'
import CenteredMessage from '../../../../components/CenteredMessage'
import Button from '../../../../components/Button'
import { Paper } from 'material-ui'
import CountFirstLevelContainer from './CountFirstLevelContainer'
import { Set as ImmutableSet } from 'immutable'


class FirstLevelLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isInitial: PropTypes.bool,

    // Levels
    firstLevel: PropTypes.instanceOf(Array).isRequired,
    secondLevel: PropTypes.instanceOf(Array).isRequired,

    // Level loading
    firstLevelLoader: PropTypes.func.isRequired,
    firstLevelCount: PropTypes.func.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // Configurations selectors
    selectedFirstLevelTypes: PropTypes.instanceOf(ImmutableSet).isRequired,
    selectedFirstLevelPredicates: PropTypes.instanceOf(ImmutableSet).isRequired,

    limit: PropTypes.number.isRequired
  };

  componentWillMount() {
    const { isInitial, secondLevel } = this.props;

    // Load data only if this loader is initial (responsible for the first load)
    if (isInitial) {
      this.load(secondLevel);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { secondLevel } = this.props;

    // Reload data only on second level change
    if (secondLevel != nextProps.secondLevel) {

      // Previous second level data contained data => reset whole component
      if (secondLevel.length > 0) {
        this.reset(nextProps.secondLevel);
      }
      // Previous second level data was empty => Application startup (level 2 finished, starting level 1) => just load.
      else {
        this.load(nextProps.secondLevel);
      }
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;

    dispatch(getFirstLevelReset());
    dispatch(setSelectedFirstLevelTypesReset());
    dispatch(setSelectedFirstLevelPredicatesReset());
  }

  // Load first level data according to second level data
  load(secondLevel) {
    const { dispatch, firstLevelLoader, firstLevelCount, selectedFirstLevelTypes, selectedFirstLevelPredicates, limit } = this.props;

    var urls = secondLevel.map(l => l.inner);
    dispatch(firstLevelLoader(urls, [...selectedFirstLevelTypes], [...selectedFirstLevelPredicates], limit));
    dispatch(firstLevelCount(urls, [...selectedFirstLevelTypes], [...selectedFirstLevelPredicates]))
  }

  // Reset the loaded data + all configurations supported at this level
  reset(secondLevel) {
    const { dispatch, firstLevelLoader, firstLevelCount, limit } = this.props;

    dispatch(setSelectedFirstLevelTypesReset());
    dispatch(setSelectedFirstLevelPredicatesReset());

    var urls = secondLevel.map(l => l.inner);

    dispatch(firstLevelLoader(urls, [], [], limit));
    dispatch(firstLevelCount(urls, [], []));
  }

  render() {
    const { dispatch, status, secondLevel, firstLevel, selectedFirstLevelTypes, selectedFirstLevelPredicates } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading things in first level..."/>
    }

    else if (firstLevel.length == 0) {
      return <div>
        <CenteredMessage>No first level things were loaded. Check the configuration.</CenteredMessage>
        <Button raised={true}
                onTouchTap={() => this.reset(secondLevel)}
                disabled={false}
                label="RESET"
        />
      </div>
    }

    var buttonsEnabled = selectedFirstLevelTypes.size > 0 || selectedFirstLevelPredicates.size > 0;

    return <Paper>
      <RecordSelector
        records={firstLevel}
        header="Thing Types:"
        getKey={t => t.outerType}
        selectedKeys={selectedFirstLevelTypes}
        onKeySelect={k => dispatch(setSelectFirstLevelType(k))}
      />
      <RecordSelector
        records={firstLevel}
        header="Properties:"
        getKey={t => t.predicate}
        selectedKeys={selectedFirstLevelPredicates}
        onKeySelect={k => dispatch(setSelectFirstLevelPredicate(k))}
      />
      <Button raised={true}
              primary={true}
              onTouchTap={() => this.load(secondLevel)}
              disabled={!buttonsEnabled}
              label="LOAD"
      />
      <Button raised={true}
              onTouchTap={() => this.reset(secondLevel)}
              disabled={false}
              label="RESET"
      />
      <CountFirstLevelContainer/>
    </Paper>
  }
}

const selector = createStructuredSelector({
  secondLevel: secondLevelSelector,

  firstLevel: firstLevelSelector,
  status: firstLevelStatusSelector,

  selectedFirstLevelTypes: selectedFirstLevelTypesSelector,
  selectedFirstLevelPredicates: selectedFirstLevelPredicatesSelector,

  limit: limitSelector
});

export default connect(selector)(FirstLevelLoader);
