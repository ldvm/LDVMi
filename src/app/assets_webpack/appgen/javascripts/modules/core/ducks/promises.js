import { Map, List } from 'immutable'
import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { PromiseStatus } from '../models'

const DEFAULT_ID = 0;

const START = 'START';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

// Reducer

const parseType = actionType => {
  for (let status of [START, SUCCESS, ERROR]) {
    if (actionType.match(status + '$')) {
      return [ actionType.replace('_' + status, ''), status ]
    }
  }

  return [];
};

const updatePromiseState = (state = Map(), id, suffix, payload) =>
  state.update(id, promiseState => updateSinglePromiseState(promiseState, suffix, payload));

const updateSinglePromiseState = (state = new PromiseStatus(), suffix, payload) => {
  switch (suffix) {

    case START:
      return state
        .set('error', '')
        .set('isLoading', true)
        .set('done', false);

    case ERROR:
      return state
        .set('error', payload.message)
        .set('isLoading', false)
        .set('done', false);

    case SUCCESS:
      return state
        .set('isLoading', false)
        .set('done', true);

    default:
      throw new Error('Unrecognized promise action type suffix: ' + suffix);
  }
};

/**
 * Universal reducer that keeps track of all promise actions in the application. A promise action
 * is recognized using its type suffix (START, SUCCESS, ERROR). The meta data sent with the action
 * might contain a specific id identifying this particular promise instance. Therefore it's
 * possible to dispatch concurrently multiple promises with the same name and keep track of their
 * states separately.
 */
export default function promisesReducer(state = new Map(), action) {
  const [name, suffix] = parseType(action.type);
  if (name) {
    const id = (action.meta && action.meta.id) ? action.meta.id : DEFAULT_ID;
    return state.update(name, promiseState =>
      updatePromiseState(promiseState, id, suffix, action.payload));
  }
  return state;
}

// Selectors

const selector = createSelector([moduleSelector], state => state.promises);
const propsSelector = (_, props) => props;

/**
 * Select status of a specific promise which is defined by its name and its id. The id might
 * dynamically depend on outer state (i. e. props) for which reason it's possible to define
 * an "idExtractor" function that can extract that information from the state and props.
 */
export function createPromiseStatusSelector(name, idExtractor = () => DEFAULT_ID) {
  return createSelector([selector, propsSelector], (state, props) =>
    state.getIn([name, idExtractor(state, props)])  || new PromiseStatus());
}

/** Return statuses of all promises of given name. */
export function createPromiseStatusesSelector(name) {
  return createSelector([selector], state =>
    state.get(name) || new Map());
}

/**
 * Aggregates a list of statues into one.
 * @param statuses
 */
const aggregateStatuses = statuses => new PromiseStatus({
    error: (statuses.filter(status => status.error != "").get(0) || new PromiseStatus()).error,
    isLoading: statuses.some(status => status.isLoading),
    done: statuses.every(status => status.done)
  });

/** Returns an aggregated status for all promises of given name */
export function createAllPromiseStatusSelector(name) {
  return createSelector(
    [createPromiseStatusesSelector([name])],
    statuses => aggregateStatuses(statuses)
  )
}

/**
 * Takes an arbitrary number of selectors and creates an aggregated promise status. Each selector
 * has to either either promise status or a map of promise statuses.
 */
export function createAggregatedPromiseStatusSelector(selectors) {
  if (!Array.isArray(selectors)) {
    throw new Error('First argument should be an array of selectors');
  }

  return (status, props) => {
    const statuses = (new List(selectors))
      .map(selector => selector(status, props))
      .flatMap((result, i) => {
        if (result instanceof PromiseStatus) {
          return new List([result]);
        } else if (result instanceof Map && result.every(status => (status instanceof PromiseStatus))) {
          return result.toList()
        } else {
          throw new Error('The selector ' + i + ' (zero based) provided invalid input. The given'
            + ' result is neither a PromiseStatus nor a Map of PromiseStatus.');
        }
      })
      .filter(status => status != null && status != undefined);

    return aggregateStatuses(statuses);
  }
}
