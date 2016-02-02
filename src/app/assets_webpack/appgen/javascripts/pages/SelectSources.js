import { connect } from 'react-redux'
import React, {Component} from 'react'
import Paper from 'material-ui/lib/paper';
import { routeActions } from 'redux-simple-router'
import SelectSourcesForm from '../modules/discovery/SelectSourcesForm'
import { addDataSources } from '../modules/discovery/api'
import { notification } from '../actions/notification'
import PaperCard from '../misc/components/PaperCard'

const SelectSources = ({dispatch}) => {

  const onSubmit = async ({url, graphUris}) => {
    try {
      graphUris = graphUris.split('\n');
      const dataSourceTemplateIds = await addDataSources([{url, graphUris}]);
      const redirect = '/discovery/?' + dataSourceTemplateIds.map(id => 'dataSourceTemplateIds=' + id).join('&');
      dispatch(routeActions.push(redirect));
    } catch (e) {
      const {message, data} = e;
      dispatch(notification(message));
      if (data) {
        throw data; // Errors for the form
      }
    }
  };

  return (
    <PaperCard title="1. Select data sources" subtitle="Select data sources for your new visualization">
      <SelectSourcesForm onSubmit={onSubmit} />
    </PaperCard>
  )
};

export default connect()(SelectSources);
