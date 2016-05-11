import React, { PropTypes } from 'react'
import { createSelector, createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { dialogOpen } from '../../core/ducks/dialog'
import { labelEditorEnabledSelector, editResourceLabel } from '../ducks/labelEditor'
import ActivatedEditableLabel from '../components/ActivatedEditableLabel'
import Label from '../../core/containers/Label'
import { dialogName } from '../dialogs/LabelEditorDialog'
import { customLabelsSelector } from '../ducks/customLabels'
import { applyCustomLabel } from '../misc/customLabelsUtils'

const EditableLabel = ({ dispatch, uri, label, editorEnabled }) => {

  const edit = () => {
    dispatch(editResourceLabel(uri));
    dispatch(dialogOpen(dialogName));
  };

  if (!editorEnabled) {
    return <Label uri={uri} label={label} />;
  }

  return (
    <ActivatedEditableLabel edit={edit}>
      <Label uri={uri} label={label} />
    </ActivatedEditableLabel>
  )
};

EditableLabel.propTypes = {
  uri: PropTypes.string.isRequired,
  label: PropTypes.any.isRequired,
  editorEnabled: PropTypes.bool.isRequired
};

const resourceUriSelector = (_, props) => props.uri;
const labelSelector = (_, props) => props.label;

const customLabelSelector = createSelector(
  [resourceUriSelector, labelSelector, customLabelsSelector],
  (resourceUri, label, customLabels) => applyCustomLabel(resourceUri, label, customLabels)
);

const selector = createStructuredSelector({
  editorEnabled: labelEditorEnabledSelector,
  label: customLabelSelector
});

export default connect(selector)(EditableLabel);
