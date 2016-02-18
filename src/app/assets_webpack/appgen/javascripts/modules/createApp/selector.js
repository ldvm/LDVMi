import { createSelector } from 'reselect'
import { List } from 'immutable'
import { DataSource, Discovery, Pipeline } from './models'

/** Select state of this module */
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

export const discoverySelector = createSelector(
  [moduleSelector],
  ({discovery: {error, isLoading, done, data} }) => ({
    error, isLoading,
    discovery: data.has('pipelineDiscovery') && data.has('userPipelineDiscovery') ?
      // Careful here, order of merging is important because both objects contain id property.
      new Discovery(data.get('pipelineDiscovery').merge(data.get('userPipelineDiscovery'))) : null,
    pipelines: data.has('pipelines') ?
      data.get('pipelines').map(pipeline => new Pipeline(pipeline)) : List()
  })
);