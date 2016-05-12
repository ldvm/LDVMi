import React, { PropTypes } from 'react'
import MenuItem from 'material-ui/lib/menus/menu-item'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Icon from '../../../components/Icon'
import { toggleLabelEditor, labelEditorEnabledSelector } from '../ducks/labelEditor'

const ToggleLabelEditorButton = ({ dispatch, enabled }) => {
  const toggle = () => dispatch(toggleLabelEditor(!enabled));

  return <MenuItem
      primaryText={enabled ? 'Stop editing labels' : 'Edit labels'}
      leftIcon={<Icon icon="mode_edit" />}
      onTouchTap={toggle}
    />
};

ToggleLabelEditorButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  enabled: PropTypes.bool.isRequired
};

const selector = createStructuredSelector({
  enabled: labelEditorEnabledSelector
});

export default connect(selector)(ToggleLabelEditorButton);
