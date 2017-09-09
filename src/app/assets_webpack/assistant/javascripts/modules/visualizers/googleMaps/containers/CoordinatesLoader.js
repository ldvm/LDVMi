import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { coordinatesSelector, coordinatesStatusSelector, getCoordinates, getCoordinatesReset } from '../ducks/coordinates'
import { getCoordinatesCount } from '../ducks/counts'
import { placesSelector } from '../ducks/places'
import { PromiseStatus } from '../../../core/models'
import PromiseResult from '../../../core/components/PromiseResult'
import Button from '../../../../components/Button'
import { limitSelector } from '../../../app/ducks/limit'
import CountCoordinatesContainer from './CountCoordinatesContainer'
import { quantifiedPlacesSelector } from '../ducks/quantifiedPlaces'

class CoordinatesLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,

    // Value loading
    coordinates: PropTypes.array.isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired,

    // Upper level
    places: PropTypes.array.isRequired,
    quantifiedPlaces: PropTypes.array.isRequired,

    // Other
    isInitial: PropTypes.bool.isRequired,
    limit: PropTypes.number.isRequired
  };

  load(places, quantifiedPlaces) {
    const { dispatch, limit } = this.props;

    var urls = [];
    if (places.length > 0) urls = places.map(p => p.coordinates);
    if (quantifiedPlaces.length > 0) urls = quantifiedPlaces.map(p => p.coordinates);

    dispatch(getCoordinates(urls, limit));
    dispatch(getCoordinatesCount(urls));
  }

  componentWillMount() {
    const { isInitial, places, quantifiedPlaces } = this.props;

    if (isInitial) {
      this.load(places, quantifiedPlaces);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.places != this.props.places) {
      this.load(nextProps.places, []);
    }
    if (nextProps.quantifiedPlaces != this.props.quantifiedPlaces) {
      this.load([], nextProps.quantifiedPlaces);
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getCoordinatesReset());
  }

  render() {
    const { status, places, quantifiedPlaces } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} error={status.error}
                            loadingMessage="Loading coordinates..."/>
    }

    return <div>
      <CountCoordinatesContainer/>
      <br/>
      <Button raised={true}
              onTouchTap={() => this.load(places, quantifiedPlaces)}
              disabled={false}
              label="RELOAD"
      />
    </div>
  }
}

const selector = createStructuredSelector({
  coordinates: coordinatesSelector,
  status: coordinatesStatusSelector,

  places: placesSelector,
  quantifiedPlaces: quantifiedPlacesSelector,

  limit: limitSelector
});

export default connect(selector)(CoordinatesLoader);