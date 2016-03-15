import { Record, Map, List } from 'immutable'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import propertiesReducer, { GET_PROPERTIES_SUCCESS } from './properties'
import skosConceptsReducer, { GET_SKOS_CONCEPTS_SUCCESS } from './skosConcepts'
import skosConceptsCountsReducer, { GET_SKOS_CONCEPTS_COUNTS_SUCCESS } from './skosConceptsCounts'
import filtersConfigReducer, { CONFIGURE_FILTER } from './filtersConfig'
import optionsConfigReducer, { CONFIGURE_OPTION, CONFIGURE_ALL_OPTIONS } from './optionsConfig'
import { Filter, Option } from '../models'

const Filters = Record({
  properties: new Map(),
  skosConcepts: new Map(),
  skosConceptsCounts: new Map(),
  filtersConfig: new Map(),
  optionsConfig: new Map(),
  filters: new Map()
});

const buildFilters = (properties, skosConcepts, filtersConfig, optionsConfig) => properties.map(property => {
  const options = (skosConcepts.get(property.schemeUri) || new Map()).map(skosConcept =>
    buildOption(skosConcept, optionsConfig.getIn([property.uri, skosConcept.uri])));
  return buildFilter(property, options, filtersConfig.get(property.uri));
});

const buildFilter = (property, options, config = new Map()) =>
  (new Filter({
    property, options,
    optionsUris: options.map(option => option.skosConcept.uri)
  })).merge(config);

const buildOption = (skosConcept, config = new Map()) =>
  (new Option({ skosConcept })).merge(config);


export default function filtersReducer(state = new Filters(), action) {
  state = state
    .update('properties', properties => propertiesReducer(properties, action))
    .update('skosConcepts', skosConcepts => skosConceptsReducer(skosConcepts, action))
    .update('skosConceptsCounts', skosConceptsCounts => skosConceptsCountsReducer(skosConceptsCounts, action))
    .update('filtersConfig', filtersConfig => filtersConfigReducer(filtersConfig, action))
    .update('optionsConfig', optionsConfig => optionsConfigReducer(optionsConfig, action))

  switch (action.type) {
    case GET_PROPERTIES_SUCCESS:
    case GET_SKOS_CONCEPTS_SUCCESS:
    case GET_SKOS_CONCEPTS_COUNTS_SUCCESS:
    case CONFIGURE_FILTER:
    case CONFIGURE_ALL_OPTIONS:
      return state.update('filters', filters => filters.mergeDeep(
        buildFilters(state.properties, state.skosConcepts, state.filtersConfig, state.optionsConfig)));

    // Perform quick little update
    case CONFIGURE_OPTION:
      const update = action.payload.update.map(option => new Map({
        options: new Map(option)
      }));
      return state.update('filters', filters => filters.mergeDeep(update));
  }

  return state;
}

// Selectors

export const filtersSelector = createSelector(
  [moduleSelector],
  state => state.filters.filters.toList() // necessary for iteration in React components
);
