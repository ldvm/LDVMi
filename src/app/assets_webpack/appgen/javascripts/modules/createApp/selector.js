import { createSelector } from 'reselect'
import { List } from 'immutable'
import { DataSource } from './models'

/** Select state of this module */
export const moduleSelector = state => state.createApp;
export default moduleSelector;

// TODO: move this to the appropriate duck
export const dataSourcesSelector = createSelector(
  [moduleSelector],
  ({dataSources: {error, isLoading, done, data}, selectedDataSources, runDiscoveryStatus }) => ({
    runDiscoveryStatus,
    dataSources: {
      error, isLoading, done,
      selected: data.toList()
        .filter(dataSource => selectedDataSources.has(dataSource.get('id')))
        .map(dataSource => (new DataSource(dataSource)).set('selected', true)),
      all: data.toList()
        .map(dataSource =>
          (new DataSource(dataSource)).set('selected', selectedDataSources.has(dataSource.get('id'))))
    }
  })
);

export const discoverySelector = createSelector(
  [moduleSelector],
  state => state.discovery
);

export const visualizersSelector = createSelector(
  [moduleSelector],
  state => state.visualizers
);
