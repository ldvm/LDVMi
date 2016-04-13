import React, { PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import prefix from '../prefix'
import Button from '../../../../components/Button'
import Dialog from '../../../core/containers/Dialog';
import { dialogClose } from '../../../core/ducks/dialog'
import { search } from '../ducks/search'
import SearchInput from '../components/SearchInput'
import SearchResult from '../components/SearchResult'
import { applicationSelector } from '../../../manageApp/ducks/application'
import { Application } from '../../../manageApp/models'

export const dialogName = prefix('SEARCH_DIALOG');

const SearchDialog = ({ dispatch, application }) => {

  const actions = [ <Button label="Close" onTouchTap={() => dispatch(dialogClose(dialogName))} /> ];

  return (
    <Dialog name={dialogName} title="Search graph data" actions={actions}>
      <SearchInput onSearch={needle => dispatch(search(application.id, needle))} />
      <SearchResult />
    </Dialog>
  );
};

SearchDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired
};

const selector = createStructuredSelector({
  application: applicationSelector
});

export default connect(selector)(SearchDialog);
