import { createSelector } from 'reselect'
import prefix from '../prefix'
import createAction from '../../../../misc/createAction'
import { Coordinates, MapState } from '../models'
import moduleSelector from '../selector'

// Actions

export const UPDATE_MAP_STATE = prefix('UPDATE_MAP_STATE');

export function updateMapState(update) {
  return createAction(UPDATE_MAP_STATE, { update });
}

// Reducers

// Initial state is Czech Republic centered on Prague. Just for the convenience.
const initialState = new MapState({
  center: new Coordinates({
    lat: 50.0880400,
    lng: 14.4207600
  }),
  zoomLevel: 7
});

export default function mapStateReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_MAP_STATE:
      return state.mergeDeep(action.payload.update);
  }

  return state;
}

// Selectors

export const mapStateSelector = createSelector([moduleSelector], state => state.mapState);
