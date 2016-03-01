import createAction from '../../../misc/createAction'
import * as api from './api'
import { GET_PROPERTIES } from './ducks/properties'
import { GET_SKOS_CONCEPTS } from './ducks/skosConcepts'
import { GET_SKOS_CONCEPTS_COUNTS } from './ducks/skosConceptsCounts'

export function queryDataset(appId) {
  return dispatch => {

    // Get properties
    const getPropertiesPromise = api.getProperties(appId);
    dispatch(createAction(GET_PROPERTIES, { promise: getPropertiesPromise }));

    // Get Skos concepts for each property
    getPropertiesPromise.then(properties => {
      properties.forEach(property => {
        const getSkosConceptsPromise = api.getSkosConcepts(appId, [property.schemeUri]);
        dispatch(createAction(GET_SKOS_CONCEPTS,
          { promise: getSkosConceptsPromise },
          { id: property.schemeUri }));

        // Get Skos concepts counts for each property
        getSkosConceptsPromise.then(skosConcepts => {
          const conceptUris = skosConcepts[property.schemeUri].map(concept => concept.uri);
          const getSkosConceptsCountsPromise =
            api.getSkosConceptsCounts(appId, property.uri, conceptUris)
            .then(counts => ({
              [property.uri]: counts
            }));

          dispatch(createAction(GET_SKOS_CONCEPTS_COUNTS,
            { promise: getSkosConceptsCountsPromise },
            { id: property.uri }));
        });
      });
    });
  }
}