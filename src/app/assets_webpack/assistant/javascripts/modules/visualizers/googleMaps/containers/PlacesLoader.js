import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { Set as ImmutableSet } from 'immutable'
import { getPlacesCount } from '../ducks/counts'
import { getPlaces, getPlacesReset, placesSelector, placesStatusSelector } from '../ducks/places'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import Button from '../../../../components/Button'
import { limitSelector } from '../../../app/ducks/limit'
import { Paper } from 'material-ui'
import RecordSelector from '../../../common/components/RecordSelector'
import { selectedPlaceTypesSelector, setSelectedPlaceTypesReset, setSelectPlaceType } from '../ducks/selectedPlaceTypes'
import { quantifiedThingsSelector } from '../ducks/quantifiedThings'
import CountPlacesContainer from './CountPlacesContainer'

class PlacesLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    // Value loading
    places: PropTypes.array.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // User selection
    selectedPlaceTypes: PropTypes.instanceOf(ImmutableSet).isRequired,

    // Upper level
    quantifiedThings: PropTypes.array.isRequired,

    // Other
    isInitial: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired
  };

  load(quantifiedThings) {
    const { dispatch, selectedPlaceTypes, limit } = this.props;

    var urls = quantifiedThings.map(p => p.place);
    dispatch(getPlaces(urls, [...selectedPlaceTypes], limit));
    dispatch(getPlacesCount(urls, [...selectedPlaceTypes]));
  }

  reload(quantifiedThings) {
    const { dispatch, limit } = this.props;
    dispatch(setSelectedPlaceTypesReset());

    var urls = quantifiedThings.map(p => p.place);
    dispatch(getPlaces(urls, [], limit));
    dispatch(getPlacesCount(urls, []));
  }

  componentWillMount() {
    const { isInitial, quantifiedThings } = this.props;
    if (isInitial) {
      this.load(quantifiedThings);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, quantifiedThings } = this.props;

    if (nextProps.quantifiedThings != quantifiedThings) {

      // Do not reset selected place types on app startup
      if (quantifiedThings.length > 0) {
        dispatch(setSelectedPlaceTypesReset());
        this.reload(nextProps.quantifiedThings);
      }
      else this.load(nextProps.quantifiedThings);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getPlacesReset());
    dispatch(setSelectedPlaceTypesReset());
  }

  render() {
    const { dispatch, places, status, selectedPlaceTypes, quantifiedThings } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading places..."/>
    }

    var buttonsEnabled = selectedPlaceTypes.size > 0;

    return <Paper>
      <RecordSelector
        records={places}
        header="Places Types:"
        getKey={t => t.placeType}
        getValue={t => t.placeType}
        selectedKeys={selectedPlaceTypes}
        onKeySelect={k => dispatch(setSelectPlaceType(k))}
      />
      <Button raised={true}
              primary={true}
              onTouchTap={() => this.load(quantifiedThings)}
              disabled={!buttonsEnabled}
              label="LOAD"
      />
      <Button raised={true}
              onTouchTap={() => this.reload(quantifiedThings)}
              disabled={false}
              label="RESET"
      />
      <CountPlacesContainer/>
    </Paper>
  }
}

const selector = createStructuredSelector({
  places: placesSelector,
  status: placesStatusSelector,

  selectedPlaceTypes: selectedPlaceTypesSelector,
  quantifiedThings: quantifiedThingsSelector,

  limit: limitSelector
});

export default connect(selector)(PlacesLoader);