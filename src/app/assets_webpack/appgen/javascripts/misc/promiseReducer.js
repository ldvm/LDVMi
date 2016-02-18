import { Record, fromJS } from 'immutable';

// Affects behavior of the reducer when the start action is dispatched. In RESET_STATE mode the
// state is always reset to default state, in PRESERVE_STATE mode is the state preserved (can be
// used for merging results from multiple calls)
export const RESET_STATE = 0;
export const PRESERVE_STATE = 1;

export default function createPromiseReducer(customInitialState, actionTypes, customReducer = null, mode = RESET_STATE) {
  const [startAction, successAction, errorAction] = actionTypes;

  // The default reducer simply stores the resolved promises' output
  const defaultReducer = (state, action) => {
    switch (action.type) {
      case successAction:
        return fromJS(action.payload);
    }

    return state;
  };

  const reducer = typeof customReducer === 'function' ? customReducer : defaultReducer;

  const InitialState = Record({
    error: "",
    isLoading: false,
    done: false,
    data: customInitialState
  });
  const initialState = InitialState();

  return (state = initialState, action) => {
    switch (action.type) {

      case startAction:
        return (mode == RESET_STATE ? initialState : state)
          .set('isLoading', true)
          .set('done', false)
          .update('data', data => reducer(data, action));

      case errorAction:
        return state
          .set('isLoading', false)
          .set('error', action.payload.message)
          .update('data', data => reducer(data, action));

      case successAction:
        return state
          .set('isLoading', false)
          .set('done', true)
          .update('data', data => reducer(data, action));
    }

    return state.update('data', data => reducer(data, action));
  }
}
