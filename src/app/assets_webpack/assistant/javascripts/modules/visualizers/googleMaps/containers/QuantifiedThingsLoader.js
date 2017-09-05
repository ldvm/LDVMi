import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import { getQuantifiedThingsCount } from '../ducks/counts'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import Button from '../../../../components/Button'
import { limitSelector } from '../../../app/ducks/limit'
import { Paper } from 'material-ui'
import RecordSelector from '../../../common/components/RecordSelector'
import CountThingsContainer from './CountQuantifiedThingsContainer'
import { selectedQuantifiedThingsSelector, setSelectedQuantifiedThingsReset, setSelectQuantifiedThing } from '../ducks/selectedQuantifiedThings'
import { getQuantifiedThings, getQuantifiedThingsReset, quantifiedThingsSelector, quantifiedThingsStatusSelector } from '../ducks/quantifiedThings'
import { selectedPlacePredicatesSelector, setSelectedPlacePredicatesReset, setSelectPlacePredicate } from '../ducks/selectedPlacePredicates'
import { selectedValuePredicatesSelector, setSelectedValuePredicatesReset, setSelectValuePredicate } from '../ducks/selectedValuePredicates'

class QuantifiedThingsLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    // Value loading
    quantifiedThings: PropTypes.array.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // User selections
    selectedThings: PropTypes.instanceOf(ImmutableSet).isRequired,
    selectedPlacePredicates: PropTypes.instanceOf(ImmutableSet).isRequired,
    selectedValuePredicates: PropTypes.instanceOf(ImmutableSet).isRequired,

    // Other
    isInitial: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired
  };

  load() {
    const { dispatch, selectedThings, selectedValuePredicates, selectedPlacePredicates, limit } = this.props;

    dispatch(getQuantifiedThings([...selectedThings], [...selectedValuePredicates], [...selectedPlacePredicates], limit));
    dispatch(getQuantifiedThingsCount([...selectedThings], [...selectedValuePredicates], [...selectedPlacePredicates]));
  }

  reset() {
    const { dispatch, limit } = this.props;
    dispatch(setSelectedQuantifiedThingsReset());
    dispatch(setSelectedPlacePredicatesReset());
    dispatch(setSelectedValuePredicatesReset());

    dispatch(getQuantifiedThings([], [], [], limit));
    dispatch(getQuantifiedThingsCount([], [], []));
  }

  componentWillMount() {
    if (this.props.isInitial) {
      this.load();
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setSelectedQuantifiedThingsReset());
    dispatch(setSelectedPlacePredicatesReset());
    dispatch(setSelectedValuePredicatesReset());
    dispatch(getQuantifiedThingsReset());
  }

  render() {
    const { dispatch, quantifiedThings, status, selectedThings, selectedValuePredicates, selectedPlacePredicates } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading connected quantified things..."/>
    }

    var buttonsEnabled = selectedThings.size > 0
      || selectedValuePredicates.size > 0
      || selectedPlacePredicates.size > 0;

    return <Paper>
      <RecordSelector
        records={quantifiedThings}
        header="Things with places:"
        getKey={t => t.url}
        selectedKeys={selectedThings}
        onKeySelect={k => dispatch(setSelectQuantifiedThing(k))}
      />
      <RecordSelector
        records={quantifiedThings}
        header="Properties with quantifiers:"
        getKey={t => t.valuePredicate}
        selectedKeys={selectedValuePredicates}
        onKeySelect={k => dispatch(setSelectValuePredicate(k))}
      />
      <RecordSelector
        records={quantifiedThings}
        header="Properties with places:"
        getKey={t => t.placePredicate}
        selectedKeys={selectedPlacePredicates}
        onKeySelect={k => dispatch(setSelectPlacePredicate(k))}
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
      <CountThingsContainer/>
    </Paper>
  }
}

const selector = createStructuredSelector({
  quantifiedThings: quantifiedThingsSelector,
  status: quantifiedThingsStatusSelector,

  selectedThings: selectedQuantifiedThingsSelector,
  selectedValuePredicates: selectedValuePredicatesSelector,
  selectedPlacePredicates: selectedPlacePredicatesSelector,

  limit: limitSelector
});

export default connect(selector)(QuantifiedThingsLoader);