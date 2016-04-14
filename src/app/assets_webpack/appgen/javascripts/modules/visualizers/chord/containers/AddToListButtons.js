import React, { PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import Button from '../../../../components/Button'
import { PromiseStatus } from '../../../core/models'
import { addToList, removeFromList } from '../ducks/lists'
import { selectedListSelector } from '../ducks/selectedList'
import { NodeList } from '../models'

const AddToListButtons = ({ dispatch, status, selectedList, uri }) => {
  return (
    <span>
      {selectedList.uris.includes(uri) ?
        <Button primary
          label="Remove"
          icon="remove_circle"
          onTouchTap={() => dispatch(removeFromList(selectedList.id, uri))}
        /> :
        <Button success
          label="Add"
          icon="add_circle"
          onTouchTap={() => dispatch(addToList(selectedList.id, uri))}
        />
      }
      <Button success
        label="Add with related"
        icon="add_circle"
      />
    </span>
  );
};

AddToListButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  selectedList: PropTypes.instanceOf(NodeList).isRequired,
  uri: PropTypes.string.isRequired
};

const selector = createStructuredSelector({
  selectedList: selectedListSelector
});

export default connect(selector)(AddToListButtons);
