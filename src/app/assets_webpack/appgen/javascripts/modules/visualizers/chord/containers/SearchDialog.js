import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import prefix from '../prefix'
import Button from '../../../../components/Button'
import Dialog from '../../../core/containers/Dialog';
import { dialogClose } from '../../../core/ducks/dialog'
import { search } from '../ducks/search'
import SearchInput from '../components/SearchInput'
import SearchResult from '../components/SearchResult'

export const dialogName = prefix('SEARCH_DIALOG');

const SearchDialog = ({ dispatch }) => {

  const actions = [ <Button label="Close" onTouchTap={() => dispatch(dialogClose(dialogName))} /> ];

  return (
    <Dialog name={dialogName} title="Search graph data" actions={actions}>
      <SearchInput onSearch={text => dispatch(search(text))} />
      <SearchResult />
    </Dialog>
  );
};

SearchDialog.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(SearchDialog);
