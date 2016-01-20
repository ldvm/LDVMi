import { routeActions } from 'redux-simple-router'
import { baseUrl } from '../config'

export function goTo(path) {
  return routeActions.push(baseUrl + '/' + path);
}

