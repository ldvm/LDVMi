import React, { PropTypes } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MenuItem from 'material-ui/lib/menus/menu-item'
import Button from '../../../../components/Button'
import { PromiseStatus } from '../../../core/models'
import { addToList, addWithRelatedToList, removeFromList } from '../ducks/lists'
import { selectedListSelector } from '../ducks/selectedList'
import { NodeList, Graph } from '../models'
import { createAddWithRelatedStatusSelector } from '../ducks/lists'
import { graphSelector } from '../ducks/graph'

const AddToListButtons = ({ dispatch, status, graph, selectedList, uri }) => {
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
      {graph.directed ?
        <IconMenu
          iconButtonElement={
            <Button success
              label="Add with related"
              icon="add_circle"
              disabled={status.isLoading}
            />}
          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
          desktop={true}
        >
          <MenuItem
            onTouchTap={() => dispatch(addWithRelatedToList(selectedList.id, uri, 'outgoing'))}
            primaryText="Add with outgoing"
          />
          <MenuItem
            onTouchTap={() => dispatch(addWithRelatedToList(selectedList.id, uri, 'incoming'))}
            primaryText="Add with incoming"
          />
        </IconMenu>
        :
        <Button success
          label="Add with related"
          icon="add_circle"
          disabled={status.isLoading}
          onTouchTap={() => dispatch(addWithRelatedToList(selectedList.id, uri))}
        />
      }
    </span>
  );
};

AddToListButtons.propTypes = {
  dispatch: PropTypes.func.isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired,
  graph: PropTypes.instanceOf(Graph).isRequired,
  selectedList: PropTypes.instanceOf(NodeList).isRequired,
  uri: PropTypes.string.isRequired
};

const selector = createStructuredSelector({
  // Status of the "getRelatedNodes" request. It's separated for each node.
  status: createAddWithRelatedStatusSelector((state, props) => props.uri),
  graph: graphSelector,
  selectedList: selectedListSelector
});

export default connect(selector)(AddToListButtons);
