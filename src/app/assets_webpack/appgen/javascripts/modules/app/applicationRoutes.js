import * as config from '../../config'

// Actual routes of a published application are handled by the visualizer itself. They define
// the entry point of the application.

export function applicationUrl(application) {
  return config.appUrl + '/' + application.id + '/' + application.uid;
}
