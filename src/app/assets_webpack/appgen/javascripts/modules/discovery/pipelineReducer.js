import { Pipeline } from './models'
import { GET_PIPELINE_START, GET_PIPELINE_ERROR, GET_PIPELINE_SUCCESS } from './actions';
import createPromiseReducer from '../../misc/promiseReducer'

const initialState = Pipeline();

export default createPromiseReducer(initialState, [
  GET_PIPELINE_START,
  GET_PIPELINE_SUCCESS,
  GET_PIPELINE_ERROR]);
