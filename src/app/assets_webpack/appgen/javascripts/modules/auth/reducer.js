import * as authActions from './actions';
import User from './User';
import {Record} from 'immutable';

const InitialState = Record({
  user: null
});
const initialState = new InitialState;

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case authActions.SIGN_IN: {
      return state.set('user', new User(action.payload));
    }
  }

  return state;
}
