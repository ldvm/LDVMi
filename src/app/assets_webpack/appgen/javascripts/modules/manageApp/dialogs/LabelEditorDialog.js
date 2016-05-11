import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import TextField from 'material-ui/lib/text-field'
import { makeValidator, errorTextFactory } from '../../../misc/formUtils'
import CenteredMessage from '../../../components/CenteredMessage'
import Button from '../../../components/Button'
import FillInScreen from '../../../components/FillInScreen'
import IgnoreDialogPadding from '../../../components/IgnoreDialogPadding'
import Padding from '../../../components/Padding'
import Dialog from '../../core/containers/Dialog'
import prefix from '../prefix'
import LabelLanguageAutoComplete from '../components/LabelLanguageAutoComplete'

export const formName = prefix('label-editor-form');
export const dialogName = prefix('LABEL_EDITOR_DIALOG');

const LabelEditorDialog = props =>  {
  const { resourceUri, dialogClose, fields: { variants }, handleSubmit, submitting, submitFailed } = props;
  const errorText = errorTextFactory(submitFailed);

  const actions = [
    <Button label="Cancel"
      onTouchTap={() => dialogClose(dialogName)} />,
    <Button label="Save" success raised  icon="done" onTouchTap={handleSubmit} />
  ];

  return (
    <Dialog name={dialogName} title="Custom label editor" actions={actions}>
      <IgnoreDialogPadding horizontal vertical>
        <FillInScreen marginBottom={150}>
          <Padding space={3}>
            <form onSubmit={handleSubmit}>
              Hey! {resourceUri}

              {!variants .length && <CenteredMessage>No custom labels yet.</CenteredMessage>}

              {variants.map((variant, index) =>
                <div key={index}>
                  <TextField floatingLabelText="Label" {...variant.label} {...errorText(variant.label)} />
                  {' '}@
                  <LabelLanguageAutoComplete floatingLabelText="Language" {...variant.lang} {...errorText(variant.lang)} />
                  <Button label="Remove" raised danger icon="remove_circle" onTouchTap={() => variants.removeField(index)} />
                </div>
              )}
              <Button label="Add label" raised  icon="add" onTouchTap={() => variants.addField()} />
            </form>
          </Padding>
        </FillInScreen>
      </IgnoreDialogPadding>
    </Dialog>
  );
};

LabelEditorDialog.propTypes = {
  resourceUri: PropTypes.string.isRequired
};

const validate = () => {};

export default reduxForm({
  form: formName,
  fields: ['variants[].lang', 'variants[].label'],
  undefined
})(LabelEditorDialog);
