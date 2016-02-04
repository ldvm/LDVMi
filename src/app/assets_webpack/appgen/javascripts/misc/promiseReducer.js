import { Record, fromJS } from 'immutable';



export default function createPromiseReducer(customInitialState, actionTypes, customReducer = null) {
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
    data: customInitialState
  });
  const initialState = InitialState();

  return (state = initialState, action) => {
    switch (action.type) {

      case startAction:
        return initialState
          .set('isLoading', true)
          .update('data', data => reducer(data, action));

      case errorAction:
        return state
          .set('isLoading', false)
          .set('error', action.payload.message)
          .update('data', data => reducer(data, action));

      case successAction:
        return state
          .set('isLoading', false)
          .update('data', data => reducer(data, action));
    }

    return state.update('data', data => reducer(data, action));
  }
}
