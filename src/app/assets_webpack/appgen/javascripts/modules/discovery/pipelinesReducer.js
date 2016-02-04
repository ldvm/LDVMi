import {List} from 'immutable';
import { GET_PIPELINES_START, GET_PIPELINES_ERROR, GET_PIPELINES_SUCCESS } from './actions';
import createPromiseReducer from '../../misc/promiseReducer'

const initialState = new List();

export default createPromiseReducer(initialState, [
  GET_PIPELINES_START,
  GET_PIPELINES_SUCCESS,
  GET_PIPELINES_ERROR]);
