import request from 'reqwest'
import when from 'when'
import debugFactory from './debug'
import { apiEndpoint } from '../config'

const debug = debugFactory('rest');

export default async function rest(url, payload = null, method = 'POST') {
  try {
    debug('API call: ' + url);
    const response = await when(request({
      url: url.startsWith('/') ? url : apiEndpoint + '/' + url,
      method: method,
      crossOrigin: true,
      type: 'json',
      contentType: 'application/json',
      data: JSON.stringify(payload)
    }));

    return response;
  } catch (response) {
    debug('API call failed with status ' + response.status);

    if (response.status === 404) {
      throw new Error('API endpoint did not recognize this call (404 Not Found)');
    } else if (response.status === 200) {
      throw new Error('API call failed but the HTTP status is 200. Probably invalid JSON?');
    } else if (response.status >= 400 && response.status < 500) {
      // If the error is on our side we expect to get valid JSON back.
      const error = JSON.parse(response.responseText);
      debug(error);
      throw error;
    } else {
      debug(response.responseText);
      throw new Error(response.responseText);
    }
  }
};
