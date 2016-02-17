import { createSelector } from 'reselect'
import { DataSource } from './models'

export const moduleSelector = state => state.createApp;
export default moduleSelector;

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