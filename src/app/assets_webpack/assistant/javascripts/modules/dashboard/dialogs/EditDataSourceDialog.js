import React from 'react';
import { reduxForm } from 'redux-form'
import { makeValidator, errorTextFactory } from '../../../misc/formUtils'
import TextField from 'material-ui/TextField';
import Checkbox from '../../../components/Checkbox'
import Button from '../../../components/Button'
import Dialog from '../../core/containers/Dialog'
import prefix from '../prefix'

export const dialogName = prefix('EDIT_DATA_SOURCE_DIALOG');
export const formName = prefix('edit-data-source');

const EditDataSourceDialog = (props) =>  {
  const { dialogClose, fields: { name, isPublic }, handleSubmit, submitting, submitFailed } = props;
  const errorText = errorTextFactory(submitFailed);

  const actions = [
    <Button label="Cancel"
      onTouchTap={() => dialogClose(dialogName)} />,
    <Button label="Save" success raised disabled={submitting}
      onTouchTap={handleSubmit} />
  ];

  return (
    <Dialog name={dialogName} title="Edit data source" actions={actions}>
      <form onSubmit={handleSubmit} className={props.className}>
        <div>
          <TextField floatingLabelText="Name" {...name} {...errorText(name)} fullWidth />
          <br /><br />
          <Checkbox label="Make this data source available to other users" {...isPublic} />
        </div>
      </form>
    </Dialog>
  );
};

const validate = makeValidator({
  properties: {
    name: {
      allowEmpty: false,
      message: 'Please specify the name of the data source'
    }
  }
});

export default reduxForm({
  form: formName,
  fields: ['name', 'isPublic'],
  validate
})(EditDataSourceDialog);
