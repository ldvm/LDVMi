import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import prefix from '../prefix'
import CenteredMessage from '../../../../components/CenteredMessage'
import Button from '../../../../components/Button'
import Dialog from '../../../core/containers/Dialog';
import { dialogClose } from '../../../core/ducks/dialog'
import SearchInput from '../components/SearchInput'
import SearchResult, { paginatorName as searchResultsPaginatorName } from '../components/SearchResult'
import { searchableLensSelector } from '../ducks/searchableLens'
import { search, searchSelector, searchStatusSelector } from '../ducks/search'
import { PromiseStatus } from '../../../core/models'
import { Lens } from '../models'
import Alert from '../../../../components/Alert'
import PullLeft from '../../../../components/PullLeft'
import Pagination from '../../../core/containers/Pagination'

export const dialogName = prefix('SEARCH_DIALOG');

const SearchDialog = ({ dispatch, searchableLens, searchResult, searchStatus }) => {

  const actions = [
    <PullLeft>
      <Pagination name={searchResultsPaginatorName} />
    </PullLeft>,
    <Button label="Close" onTouchTap={() => dispatch(dialogClose(dialogName))} />
  ];

  return (
    <Dialog name={dialogName} title="Search graph data" actions={actions} width={1000}>
      <SearchInput
        disabled={searchStatus.isLoading}
        onSearch={needle => dispatch(search(needle))} />
      
      {searchStatus.error &&
        <Alert danger>{searchStatus.error}</Alert>}

      {searchResult.size > 0 ?
        <SearchResult
          searchableLens={searchableLens}
          result={searchResult}
        /> :
        <CenteredMessage>
          <br />
          {searchStatus.done ?
            <span>Nothing found. Try different search phrase.</span> :
            <span>No results available. Start searching.</span>}
        </CenteredMessage>
      }
    </Dialog>
  );
};

SearchDialog.propTypes = {
  dispatch: PropTypes.func.isRequired,
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  searchResult: PropTypes.instanceOf(List).isRequired,
  searchStatus: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createStructuredSelector({
  searchableLens: searchableLensSelector,
  searchResult: searchSelector,
  searchStatus: searchStatusSelector
});

export default connect(selector)(SearchDialog);
