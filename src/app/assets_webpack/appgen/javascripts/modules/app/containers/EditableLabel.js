import React, { PropTypes } from 'react'
import { Map } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { dialogOpen } from '../../core/ducks/dialog'
import { labelEditorEnabledSelector, editResourceLabel } from '../ducks/labelEditor'
import ActivatedEditableLabel from '../components/ActivatedEditableLabel'
import Label from './Label'
import { dialogName } from '../dialogs/LabelEditorDialog'
import { customLabelsSelector } from '../ducks/customLabels'
import { applyCustomLabel } from '../misc/customLabelsUtils'
import makePureRender from '../../../misc/makePureRender'

const EditableLabel = ({ dispatch, uri, label, editorEnabled, customLabels }) => {
  const customLabel = applyCustomLabel(uri, label, customLabels) ;

  const edit = () => {
    dispatch(editResourceLabel(uri));
    dispatch(dialogOpen(dialogName));
  };

  if (!editorEnabled) {
    return <Label uri={uri} label={customLabel} />;
  }

  return (
    <ActivatedEditableLabel edit={edit}>
      <Label uri={uri} label={customLabel} />
    </ActivatedEditableLabel>
  )
};

EditableLabel.propTypes = {
  uri: PropTypes.string.isRequired,
  label: PropTypes.any.isRequired,
  editorEnabled: PropTypes.bool.isRequired,
  customLabels: PropTypes.instanceOf(Map).isRequired
};

const selector = createStructuredSelector({
  editorEnabled: labelEditorEnabledSelector,
  customLabels: customLabelsSelector
});

export default connect(selector)(makePureRender(EditableLabel));
