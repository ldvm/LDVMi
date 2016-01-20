import { useRouterHistory } from 'react-router'
import { createHistory, useBasename } from 'history'
import { baseUrl } from '../config'

// Custom history used for react-router. Defines baseURL so
// that the app can run in a subdirectory.
export default  useRouterHistory(useBasename(createHistory))({
  basename: baseUrl
});
