import { Map, Record } from 'immutable'

const DEFAULT_ID = 0;

const START = 'START';
const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

/** Representation of a single promise status */
export const PromiseStatus = Record({
  error: "",
  isLoading: false,
  done: false
});

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

/**
 * Select status of a specifi promise which is defined by its name and its id. The id might
 * dynamically depend on outer state (i. e. props) for which reason it's possible to define
 * an "idExtractor" function that can extrat that information from the state and props.
 */
export function createPromiseStatusSelector(name, idExtractor = () => DEFAULT_ID) {
  return (state, props) =>
    state.promises.getIn([name, idExtractor(state, props)])  || new PromiseStatus();
}
