import { createSelector } from 'reselect'
import prefix from '../prefix'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import { createGetConfiguration, createSaveConfiguration } from '../../../app/ducks/configuration'

// Actions

export const SAVE_CONFIGURATION = prefix('SAVE_CONFIGURATION');
export const SAVE_CONFIGURATION_START = SAVE_CONFIGURATION + '_START';
export const SAVE_CONFIGURATION_ERROR = SAVE_CONFIGURATION + '_ERROR';
export const SAVE_CONFIGURATION_SUCCESS = SAVE_CONFIGURATION + '_SUCCESS';

export const GET_CONFIGURATION = prefix('GET_CONFIGURATION');
export const GET_CONFIGURATION_START = GET_CONFIGURATION + '_START';
export const GET_CONFIGURATION_ERROR = GET_CONFIGURATION + '_ERROR';
export const GET_CONFIGURATION_SUCCESS = GET_CONFIGURATION + '_SUCCESS';

// Selectors

export const saveConfigurationStatusSelector = createPromiseStatusSelector(SAVE_CONFIGURATION);
export const getConfigurationStatusSelector = createPromiseStatusSelector(GET_CONFIGURATION);

export const configurationSelector = createSelector(
  [moduleSelector],
  state => ({
    filtersConfig: state.filters.filtersConfig.toJS(),
    optionsConfig: state.filters.optionsConfig.toJS(),
    mapState: state.mapState.toJS(),
    publishSettings: state.publishSettings.toJS(),

    selectedQuantifiedThings: state.selectedQuantifiedThings.toJS(),
    selectedPlaceTypes: state.selectedPlaceTypes.toJS(),
    selectedPlacePredicates: state.selectedPlacePredicates.toJS(),
    selectedValuePredicates: state.selectedValuePredicates.toJS()
  })
);

// Actual actions created using factories
export const saveConfiguration = createSaveConfiguration(SAVE_CONFIGURATION, configurationSelector);
export const getConfiguration = createGetConfiguration(GET_CONFIGURATION);

