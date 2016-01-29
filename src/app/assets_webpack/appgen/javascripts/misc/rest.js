import request from 'reqwest'
import when from 'when'
import debugFactory from './debug'
import { apiEndpoint } from '../config'

const debug = debugFactory('rest');

export default async function rest(url, payload) {
  try {
    debug('API call: ' + url);
    const response = await when(request({
      url: apiEndpoint + '/' + url,
      method: 'POST',
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify(payload)
    }));

    // TODO: do finer error handling

    return response;
  } catch (e) {
    debug('API call failed.');
    debug(e);
    throw e;
  }
};