import { Map, List, fromJS } from 'immutable'
import { createSelector } from 'reselect'
import prefix from '../prefix'
import moduleSelector  from '../selector'
import createAction from '../../../../misc/createAction'
import { Filter, Option } from '../models'
import { propertiesSelector } from './properties'
import { skosConceptsSelector, skosConceptsStatusesSelector } from './skosConcepts'
import { optionsConfigSelector } from './options'

// Actions

export const CONFIGURE_FILTER = prefix('CONFIGURE_FILTER');

export function configureFilter(propertyUri, settings) {
  return createAction(CONFIGURE_FILTER, { propertyUri, settings });
}

// Reducer

export default function filtersReducer(state = new Map(), action) {
  switch (action.type) {
    case CONFIGURE_FILTER:
      const { propertyUri, settings } = action.payload;
      const update = fromJS({ [propertyUri]: settings });
      return state.mergeDeep(update);
  }

  return state;
};

// Selectors

const filtersConfigSelector = createSelector([moduleSelector], state => state.filters);

export const defaultFiltersSelector = createSelector(
  [propertiesSelector, skosConceptsSelector],
  (properties, skosConcepts) => properties.map(property => {
    const options = (skosConcepts.get(property.schemeUri) || new List()).map(skosConcept =>
      new Option({ skosConcept }));
    const optionsUris = options.map(option => option.skosConcept.uri);
    return new Filter({ property, options, optionsUris });
  })
);

export const filtersSelector = createSelector(
  [defaultFiltersSelector, skosConceptsStatusesSelector, filtersConfigSelector, optionsConfigSelector],
  (filters, skosConceptsStatuses, filtersConfig, optionsConfig) => filters.map(filter =>
    filter
      .merge(filtersConfig.get(filter.property.uri) || new Map())
      .update('optionsStatus', status => skosConceptsStatuses.get(filter.property.schemeUri) || status)
      .update('options', options => options.map(option =>
        option.merge(optionsConfig.getIn([filter.property.uri, option.skosConcept.uri]) || new Map())
      ))
  )
);
