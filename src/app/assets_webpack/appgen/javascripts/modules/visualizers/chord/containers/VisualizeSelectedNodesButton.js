import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Button from '../../../../components/Button'
import { visualizeSelectedNodes } from '../ducks/visualizedNodes'

const VisualizeSelectedNodesButton = props => {
  const { dispatch } = props;

  return <Button warning raised
     onTouchTap={() => dispatch(visualizeSelectedNodes())}
     icon="refresh"
     label="Visualize selected"
     {...props}
  />
};

VisualizeSelectedNodesButton.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(VisualizeSelectedNodesButton);
