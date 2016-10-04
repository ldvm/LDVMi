import React, { PropTypes } from 'react'
import { is } from 'immutable'
import { createSelector } from 'reselect'
import { connect } from 'react-redux'
import Button from '../../../../components/Button'
import { visualizedNodesSelector, visualizeSelectedNodes } from '../ducks/visualizedNodes'
import { selectedListSelector } from '../ducks/selectedList'

const VisualizeSelectedNodesButton = props => {
  const { dispatch, disabled } = props;

  return <Button warning raised
     onTouchTap={() => dispatch(visualizeSelectedNodes())}
     disabled={disabled}
     icon="refresh"
     label="Visualize"
     {...props}
  />
};

VisualizeSelectedNodesButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired
};

const selector = createSelector(
  [visualizedNodesSelector, selectedListSelector],
  (visualizedNodes, selectedList) => ({
    // Enable the button only when there is something new to visualize
    disabled: is(visualizedNodes, selectedList.selected)
  })
);

export default connect(selector)(VisualizeSelectedNodesButton);
