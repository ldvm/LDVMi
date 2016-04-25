import * as config from '../../config'

export function applicationUrl(application) {
  return config.appUrl + '/' + application.id + '/' + application.uid;
}
