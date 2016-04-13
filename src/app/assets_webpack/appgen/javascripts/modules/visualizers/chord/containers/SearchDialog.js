import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import prefix from '../prefix'
import Button from '../../../../components/Button'
import Dialog from '../../../core/containers/Dialog';
import { dialogClose } from '../../../core/ducks/dialog'
import SearchInput from '../components/SearchInput'
import SearchResult from '../components/SearchResult'
import { applicationSelector } from '../../../manageApp/ducks/application'
import { Application } from '../../../manageApp/models'
import { searchableLensSelector } from '../ducks/searchableLens'
import { search, searchSelector, searchStatusSelector } from '../ducks/search'
import { PromiseStatus } from '../../../core/models'
import { Lens } from '../models'
import Alert from '../../../../components/Alert'

export const dialogName = prefix('SEARCH_DIALOG');

const SearchDialog = ({ dispatch, application, searchableLens, searchResult, searchStatus }) => {

  const actions = [ <Button label="Close" onTouchTap={() => dispatch(dialogClose(dialogName))} /> ];

  return (
    <Dialog name={dialogName} title="Search graph data" actions={actions}>
      <SearchInput
        disabled={searchStatus.isLoading}
        onSearch={needle => dispatch(search(application.id, needle))} />
      
      {searchStatus.error &&
        <Alert danger>{searchStatus.error}</Alert>}

      <SearchResult
        searchableLens={searchableLens}
        result={searchResult}
      />
    </Dialog>
  );
};

SearchDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired,
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  searchResult: PropTypes.instanceOf(List).isRequired,
  searchStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createStructuredSelector({
  application: applicationSelector,
  searchableLens: searchableLensSelector,
  searchResult: searchSelector,
  searchStatus: searchStatusSelector
});

export default connect(selector)(SearchDialog);
