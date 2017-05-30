import createAction from "../../../../misc/createAction";
import withApplicationId from "../../../app/misc/withApplicationId";
import prefix from "../prefix";
import * as api from "../api";
import {Counts} from "../models";
import {createSelector} from "reselect";
import {createPromiseStatusSelector} from "../../../core/ducks/promises";
import moduleSelector from "../selector";
import {GET_APPLICATION_START} from "../../../app/ducks/application";

// Actions
export const GET_COORDINATES_COUNT = prefix('GET_COORDINATES_COUNT');
export const GET_COORDINATES_COUNT_SUCCESS = GET_COORDINATES_COUNT + '_SUCCESS';

export function getCoordinatesCount(urls) {
    return withApplicationId(id => {
        const promise = api.getCoordinatesCount(id, urls);
        return createAction(GET_COORDINATES_COUNT, {promise});
    });
}

export const GET_PLACES_COUNT = prefix('GET_PLACES_COUNT');
export const GET_PLACES_COUNT_SUCCESS = GET_PLACES_COUNT + '_SUCCESS';

export function getPlacesCount(urls, types) {
    return withApplicationId(id => {
        const promise = api.getPlacesCount(id, urls, types);
        return createAction(GET_PLACES_COUNT, {promise});
    });
}

export const GET_TWP_COUNT = prefix('GET_THINGS_WITH_PLACES_COUNT');
export const GET_TWP_COUNT_SUCCESS = GET_TWP_COUNT + '_SUCCESS';

export function getThingsWithPlacesCount(urls, connections) {
    return withApplicationId(id => {
        const promise = api.getThingsWithPlacesCount(id, urls, [], connections);
        return createAction(GET_TWP_COUNT, {promise});
    });
}

export const GET_QUANTIFIERS_COUNT = prefix('GET_QUANTIFIERS_COUNT');
export const GET_QUANTIFIERS_COUNT_SUCCESS = GET_QUANTIFIERS_COUNT + '_SUCCESS';


export function getQuantifiersCount(urls, connections) {
    return withApplicationId(id => {
        const promise = api.getQuantifiersCount(id, urls, connections);
        return createAction(GET_QUANTIFIERS_COUNT, {promise});
    });
}

export const GET_COUNTS_RESET = prefix('GET_COUNTS_RESET');

export function getQuantifiersReset() {
    return createAction(GET_COUNTS_RESET);
}

// Reducer
const initialState = new Counts();
export default function countReducer(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATION_START:
            return initialState;
        case GET_COUNTS_RESET:
            return initialState;
        case GET_COORDINATES_COUNT_SUCCESS:
            return new Counts({
                coordinates: action.payload.value,
                places: state.places,
                thingsWithPlaces: state.thingsWithPlaces,
                quantifiers: state.quantifiers
            });
        case GET_PLACES_COUNT_SUCCESS:
            return new Counts({
                coordinates: state.coordinates,
                places: action.payload.value,
                thingsWithPlaces: state.thingsWithPlaces,
                quantifiers: state.quantifiers
            });
        case GET_TWP_COUNT_SUCCESS:
            return new Counts({
                coordinates: state.coordinates,
                places: state.places,
                thingsWithPlaces: action.payload.value,
                quantifiers: state.quantifiers
            });
        case GET_QUANTIFIERS_COUNT_SUCCESS:
            return new Counts({
                coordinates: state.coordinates,
                places: state.places,
                thingsWithPlaces: state.thingsWithPlaces,
                quantifiers: action.payload.value
            });
    }
    return state;
};

// Selectors
export const coordinatesCountStatusSelector = createPromiseStatusSelector(GET_COORDINATES_COUNT);
export const coordinatesCountSelector = createSelector([moduleSelector], state => state.count.coordinates);

export const placesCountStatusSelector = createPromiseStatusSelector(GET_PLACES_COUNT);
export const placesCountSelector = createSelector([moduleSelector], state => state.count.places);

export const thingsWithPlacesCountStatusSelector = createPromiseStatusSelector(GET_TWP_COUNT);
export const thingsWithPlacesCountSelector = createSelector([moduleSelector], state => state.count.thingsWithPlaces);

export const quantifiersCountStatusSelector = createPromiseStatusSelector(GET_QUANTIFIERS_COUNT);
export const quantifiersCountSelector = createSelector([moduleSelector], state => state.count.quantifiers);