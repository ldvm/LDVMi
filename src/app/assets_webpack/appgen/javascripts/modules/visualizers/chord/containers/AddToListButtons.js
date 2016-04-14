import React, { PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import Button from '../../../../components/Button'
import { PromiseStatus } from '../../../core/models'
import { addToList, addWithRelatedToList, removeFromList } from '../ducks/lists'
import { selectedListSelector } from '../ducks/selectedList'
import { NodeList } from '../models'
import { createAddWithRelatedStatusSelector } from '../ducks/lists'

const AddToListButtons = ({ dispatch, status, selectedList, uri }) => {
  return (
    <span>
      {selectedList.uris.includes(uri) ?
        <Button primary
          label="Remove"
          icon="remove_circle"
          disabled={status.isLoading}
          onTouchTap={() => dispatch(removeFromList(selectedList.id, uri))}
        /> :
        <Button success
          label="Add"
          icon="add_circle"
          disabled={status.isLoading}
          onTouchTap={() => dispatch(addToList(selectedList.id, uri))}
        />
      }
      <Button success
        label="Add with related"
        icon="add_circle"
        disabled={status.isLoading}
        onTouchTap={() => dispatch(addWithRelatedToList(selectedList.id, uri))}
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
  // Status of the "getRelatedNodes" request. It's separated for each node.
  status: createAddWithRelatedStatusSelector((state, props) => props.uri),
  selectedList: selectedListSelector
});

export default connect(selector)(AddToListButtons);
