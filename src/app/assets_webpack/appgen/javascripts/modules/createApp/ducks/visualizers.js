import { createSelector } from 'reselect'
import { Map } from 'immutable'
import { Visualizer } from '../models'
import { visualizersSelector as reducerSelector } from '../selector'

// Reducers

// Just a sample visualizer
const mapsVisualizer = new Visualizer({
  id: 1,
  stringId: 'maps',
  name: 'Google Maps',
  icon: 'maps'
});

const initialState = (new Map()).set(mapsVisualizer.stringId, mapsVisualizer);

export default function visualizersReducer(state = initialState) {
  return state;
};

// Selectors

export const visualizersSelector = reducerSelector
