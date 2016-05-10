import React, { PropTypes } from 'react'
import Button from '../../../components/Button'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { toggleLabelEditor, labelEditorEnabledSelector } from '../ducks/labelEditor'

const ToggleLabelEditorButton = ({ dispatch, enabled }) => {
  const toggle = () => dispatch(toggleLabelEditor(!enabled));

  return enabled ?
    <Button label="Stop editing labels" icon="mode_edit" raised warning onTouchTap={toggle} /> :
    <Button label="Edit labels" icon="mode_edit" raised onTouchTap={toggle} />;
};

ToggleLabelEditorButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired
};

const selector = createStructuredSelector({
  enabled: labelEditorEnabledSelector
});

export default connect(selector)(ToggleLabelEditorButton);
