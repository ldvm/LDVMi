import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { PublishSettings, Graph } from '../models'
import { updatePublishSettings, publishSettingsSelector } from '../ducks/publishSettings'
import { graphSelector } from '../ducks/graph'
import PublishSettingsMenu from '../components/PublishSettingsMenu'

const PublishSettingsContainer = ({ dispatch, publishSettings, graph }) => {
  return <PublishSettingsMenu
    updatePublishSettings={update => dispatch(updatePublishSettings(update))}
    publishSettings={publishSettings}
    graph={graph}
  />
};

PublishSettingsContainer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  publishSettings: PropTypes.instanceOf(PublishSettings),
  graph: PropTypes.instanceOf(Graph)
};

const selector = createStructuredSelector({
  publishSettings: publishSettingsSelector,
  graph: graphSelector
});

export default connect(selector)(PublishSettingsContainer);
