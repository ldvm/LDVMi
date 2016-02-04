import {List} from 'immutable';
import { GET_PIPELINE_EVALUATIONS_START, GET_PIPELINE_EVALUATIONS_SUCCESS, GET_PIPELINE_EVALUATIONS_ERROR } from './actions';
import createPromiseReducer from '../../misc/promiseReducer'

const initialState = new List();

export default createPromiseReducer(initialState, [
  GET_PIPELINE_EVALUATIONS_START,
  GET_PIPELINE_EVALUATIONS_SUCCESS,
  GET_PIPELINE_EVALUATIONS_ERROR]);
