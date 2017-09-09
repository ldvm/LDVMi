import { Map, Record } from 'immutable'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import propertiesReducer, { GET_PROPERTIES_SUCCESS } from './properties'
import skosConceptsReducer, { GET_SKOS_CONCEPTS_SUCCESS } from './skosConcepts'
import skosConceptsCountsReducer, { GET_SKOS_CONCEPTS_COUNTS_SUCCESS } from './skosConceptsCounts'
import filtersConfigReducer, { CONFIGURE_FILTER, EXPAND_FILTER } from './filtersConfig'
import optionsConfigReducer, { CONFIGURE_ALL_OPTIONS, CONFIGURE_OPTION, validateOptionsUpdate } from './optionsConfig'
import { Filter, Option } from '../models'
import { GET_APPLICATION_START } from '../../../app/ducks/application'

// Helping stuff

const Filters = Record({
  properties: new Map(),
  skosConcepts: new Map(),
  skosConceptsCounts: new Map(),
  filtersConfig: new Map(),
  optionsConfig: new Map(),
  filters: new Map()
});

const buildFilters = (properties, skosConcepts, skosConceptsCounts, filtersConfig, optionsConfig) => properties.map(property => {
  const options = (skosConcepts.get(property.schemeUri) || new Map()).map(skosConcept =>
    buildOption(skosConcept,
      skosConceptsCounts.getIn([property.uri, skosConcept.uri]),
      optionsConfig.getIn([property.uri, skosConcept.uri])
    ));
  return buildFilter(property, options, filtersConfig.get(property.uri));
});

const buildFilter = (property, options, config = new Map()) =>
  (new Filter({
    property, options,
    optionsUris: options.map(option => option.skosConcept.uri)
  })).merge(config);

const buildOption = (skosConcept, count = null, config = new Map()) =>
  (new Option({ skosConcept, count })).merge(config);

// Reducer

export default function filtersReducer(state = new Filters(), action) {
  state = state
    .update('properties', properties => propertiesReducer(properties, action))
    .update('skosConcepts', skosConcepts => skosConceptsReducer(skosConcepts, action))
    .update('skosConceptsCounts', skosConceptsCounts => skosConceptsCountsReducer(skosConceptsCounts, action))
    .update('filtersConfig', filtersConfig => filtersConfigReducer(filtersConfig, action))
    .update('optionsConfig', optionsConfig => optionsConfigReducer(optionsConfig, action))

  switch (action.type) {
    case GET_APPLICATION_START:
      return new Filters();

    case GET_PROPERTIES_SUCCESS:
    case GET_SKOS_CONCEPTS_SUCCESS:
    case GET_SKOS_CONCEPTS_COUNTS_SUCCESS:
    case CONFIGURE_FILTER:
    case CONFIGURE_ALL_OPTIONS:
      return state.update('filters', filters => filters.mergeDeep(
        buildFilters(state.properties, state.skosConcepts, state.skosConceptsCounts, state.filtersConfig, state.optionsConfig)));

    // Perform quick little update on a single option
    case CONFIGURE_OPTION:
      const update = validateOptionsUpdate(state.optionsConfig, action.payload.update).map(option => new Map({
        options: new Map(option)
      }));
      return state.update('filters', filters => filters.mergeDeep(update));

    // Perform quick little update when expanding the filter
    case EXPAND_FILTER:
      return state.update('filters', filters => filters.mergeDeep(action.payload.update));
  }

  return state;
}

// Selectors

export const filtersSelector = createSelector(
  [moduleSelector],
  state => state.filters.filters
);
