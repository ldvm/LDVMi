import React from 'react';
import { connect } from 'react-redux'
import { reduxForm } from 'redux-form';
import { makeValidator, errorTextFactory } from '../../../misc/formUtils'
import { dialogClose } from '../../../ducks/dialog'
import TextField from 'material-ui/lib/text-field';
import Checkbox from '../../../misc/components/Checkbox';
import Button from '../../../misc/components/Button'
import Dialog from '../../../containers/Dialog';

export const dialogName = 'ADD_DATA_SOURCE_DIALOG';
export const formName = 'add-data-source';

const AddDataSourceDialog = (props) =>  {
  const {dialogClose, fields: {name, url, graphUris, isPublic}, handleSubmit, submitting, submitFailed} = props;
  const errorText = errorTextFactory(submitFailed);

  const actions = [
    <Button label="Cancel"
      onTouchTap={() => dialogClose(dialogName)} />,
    <Button label="Add source" success raised disabled={submitting}
      onTouchTap={handleSubmit} />
  ];

  return (
    <Dialog name={dialogName} title="Add new data source" actions={actions} modal={false}>
      <form onSubmit={handleSubmit} className={props.className}>
        <div>
          <TextField floatingLabelText="Name" {...name} {...errorText(name)} fullWidth />
          <TextField floatingLabelText="Endpoint URL" {...url} {...errorText(url)} fullWidth />
          <TextField floatingLabelText="Graph URIs (line separated, optional)"
            multiLine={true} rows={1} rowsMax={4}
            {...graphUris} {...errorText(graphUris)} fullWidth />
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
      message: 'Please specify the name of the new data source'
    },
    url: {
      allowEmpty: false,
      message: 'Please specify an endpoint'
    },
    graphUris: {
      allowEmpty: true
    }
  }
});

const DialogComponent = reduxForm({
  form: formName,
  fields: ['name', 'url', 'graphUris', 'isPublic'],
  validate
})(AddDataSourceDialog);

DialogComponent.dialogName = dialogName;
DialogComponent.formName = formName;

export default DialogComponent;
