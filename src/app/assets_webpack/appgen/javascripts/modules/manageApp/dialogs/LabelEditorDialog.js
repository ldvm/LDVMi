import React, { PropTypes } from 'react'
import { reduxForm } from 'redux-form'
import { errorTextFactory } from '../../../misc/formUtils'
import CenteredMessage from '../../../components/CenteredMessage'
import Button from '../../../components/Button'
import FillInScreen from '../../../components/FillInScreen'
import IgnoreDialogPadding from '../../../components/IgnoreDialogPadding'
import Padding from '../../../components/Padding'
import Dialog from '../../core/containers/Dialog'
import prefix from '../prefix'
import VariantFormRow from '../components/labelEditor/VariantFormRow'
import validate from '../misc/validateCustomLabels'

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
    <Dialog name={dialogName} title="Custom labels editor" actions={actions}>
      <IgnoreDialogPadding horizontal vertical>
        <FillInScreen marginBottom={120}>
          <Padding space={3}>
            <form onSubmit={handleSubmit}>
              <div>Labels defined here take precedence over the default ones.</div>
              <p>Resource: <code>{resourceUri}</code></p>

              {!variants .length && <CenteredMessage>No custom labels yet.</CenteredMessage>}

              {variants.map((variant, index) =>
                <VariantFormRow
                  key={index}
                  label={{ ...variant.label, ...errorText(variant.label)}}
                  lang={{ ...variant.lang, ...errorText(variant.lang)}}
                  remove={() => variants.removeField(index)}
                />
              )}

              <CenteredMessage>
                <Button raised
                  label="Add label variant"
                  icon="add"
                  onTouchTap={() => variants.addField()}
                />
              </CenteredMessage>
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

export default reduxForm({
  form: formName,
  fields: ['variants[].lang', 'variants[].label'],
  validate
})(LabelEditorDialog);
