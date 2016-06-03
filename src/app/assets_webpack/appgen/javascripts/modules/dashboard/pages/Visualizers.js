import React, { PropTypes, Component } from 'react'
import { List, Map } from 'immutable'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import * as routes from '../routes'
import Padding from '../../../components/Padding'
import PromiseResult from '../../core/components/PromiseResult'
import Button from '../../../components/Button'
import PullRight from '../../../components/PullRight'
import CenteredMessage from '../../../components/CenteredMessage'
import ClearBoth from '../../../components/ClearBoth'
import Pagination from '../../core/containers/Pagination'
import { getApplications, getApplicationsReset, deleteApplication, APPLICATIONS_PAGINATOR, createApplicationsSelector, createApplicationsStatusSelector } from '../ducks/applications'
import { destroyPaginator, resetPaginator } from '../../core/ducks/pagination'
import { PromiseStatus } from '../../core/models'
import ApplicationsTable from '../components/ApplicationsTable'
import { visualizersSelector } from '../../core/ducks/visualizers'
import { createAggregatedPromiseStatusSelector } from '../../core/ducks/promises'
import { visualizersStatusSelector } from '../../core/ducks/visualizers'
import { getVisualizerComponents, getVisualizerComponentsReset, visualizerComponentsSelector, visualizerComponentsStatusSelector } from '../ducks/visualizerComponents'
import { dialogOpen, dialogClose } from '../../core/ducks/dialog'
import AddVisualizerDialog, { dialogName as addVisualizerDialogName } from '../dialogs/AddVisualizerDialog'
import * as api from '../api'
import { notification } from '../../core/ducks/notifications'
import { addVisualizer } from '../../core/ducks/visualizers'


class Applications extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    visualizers: PropTypes.instanceOf(List).isRequired,
    visualizerComponents: PropTypes.instanceOf(Map).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getVisualizerComponents());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getVisualizerComponentsReset());
  }

  async handleSubmit(values) {
    const { dispatch } = this.props;
    try {
      const visualizer = await api.addVisualizationConfiguration(values.componentTemplateUri);
      dispatch(notification('The visualizer has been created'));
      dispatch(dialogClose(addVisualizerDialogName));
      dispatch(addVisualizer(visualizer));
    } catch (e) {
      const { message, data } = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  }

  render() {
    const { dispatch, visualizers, visualizerComponents, status } = this.props;

    return (
      <div>
        {visualizers.size > 0 &&
          visualizers.map(visualizer => <div>{visualizer.title}</div>)
        }
        {/*
        {visualizers.size > 0 &&
          <DataSourcesTable
            dataSources={dataSources}
            editDataSource={::this.editDataSource}
            deleteDataSource={::this.deleteDataSource}
          />}
          */}

        {/*
        <EditDataSourceDialog
          onSubmit={::this.handleUpdateDataSource}
          initialValues={dataSourceToEdit.toJS()}
          dialogClose={name => dispatch(dialogClose(name))}
        />
        */}
        <AddVisualizerDialog
          onSubmit={::this.handleSubmit}
          visualizerComponents={visualizerComponents}
          dialogClose={() => dispatch(dialogClose(addVisualizerDialogName))}
        />

        <Padding space={2}>
          {visualizers.size == 0 && (
            <div>
              {status.done && <CenteredMessage>No visualizers found.</CenteredMessage>}
              <PromiseResult status={status} loadingMessage="Loading visualizers..."/>
            </div>
          )}

          {visualizerComponents.size > 0 && (
            <PullRight>
              <Button raised success
                label="Add visualizer"
                icon="add"
                onTouchTap={() => dispatch(dialogOpen(addVisualizerDialogName))}
              />
            </PullRight>
          )}
          <ClearBoth />
        </Padding>
      </div>
    );
  }
}

// The user is allowed to create only one visualizer for each LDVM visualizer component. So let's
// remove those components that are already used.
const unusedVisualizerComponentsSelector = createSelector(
  [visualizersSelector, visualizerComponentsSelector],
  (visualizers, visualizerComponents) =>
    visualizers.reduce((unused, visualizer) =>
      unused.delete(visualizer.componentTemplateId), visualizerComponents)
);

const selector = createStructuredSelector({
  visualizers: visualizersSelector,
  visualizerComponents: unusedVisualizerComponentsSelector,
  status: createAggregatedPromiseStatusSelector([
    visualizersStatusSelector,
    visualizerComponentsStatusSelector
  ])
});

export default connect(selector)(Applications);
