import { routeActions } from 'redux-simple-router'

const baseUrl = '/appgen'; // TODO: load from config

export function goTo(path) {
  return routeActions.push(baseUrl + '/' + path);
}

