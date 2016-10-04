import React from 'react';
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form';
import { makeValidator, errorTextFactory } from '../../../misc/formUtils'
import { dialogClose } from '../../core/ducks/dialog'
import TextField from 'material-ui/TextField';
import Checkbox from '../../../components/Checkbox';
import Button from '../../../components/Button'
import Dialog from '../../core/containers/Dialog';

export const formName = 'general-settings';
export const dialogName = 'GENERAL_SETTINGS_DIALOG';

const GeneralSettingsDialog = props =>  {
  const {dialogClose, fields: {name, description, updateUrl}, handleSubmit, submitting, submitFailed} = props;
  const errorText = errorTextFactory(submitFailed);

  const actions = [
    <Button label="Cancel"
      onTouchTap={() => dialogClose(dialogName)} />,
    <Button label="Save" success raised disabled={submitting} icon="done"
      onTouchTap={handleSubmit} />
  ];

  return (
    <Dialog name={dialogName} title="General settings" actions={actions}>
      <form onSubmit={handleSubmit} className={props.className}>
        <div>
          <TextField floatingLabelText="Name" {...name} {...errorText(name)} fullWidth />
          <TextField floatingLabelText="Description"
             multiLine={true} rows={1} rowsMax={4}
            {...description} {...errorText(description)} fullWidth />
          <br /><br />
          <Checkbox label="Use the new name to update app's URL" {...updateUrl} />
        </div>
      </form>
    </Dialog>
  );
};

const validate = makeValidator({
  properties: {
    name: {
      allowEmpty: false,
      message: 'Please specify the name of the view'
    }
  }
});

export default reduxForm({
  form: formName,
  fields: ['name', 'description', 'updateUrl'],
  validate
})(GeneralSettingsDialog);
