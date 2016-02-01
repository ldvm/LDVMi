import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import TextField from 'material-ui/lib/text-field';
import RaisedButton from 'material-ui/lib/raised-button';
import { makeValidator, errorText } from '../../misc/formUtils'

const SelectSourcesForm = (props) => {
  const {fields: {url, graphUris}, handleSubmit, submitting} = props;

  return (
    <form onSubmit={handleSubmit} className={props.className}>
      <div>
        <TextField floatingLabelText="Endpoint URL" {...url} {...errorText(url)} fullWidth />
        <TextField floatingLabelText="Graph URIs (line separated)" type="password"
          multiLine={true} rows={1} rowsMax={4}
          {...graphUris} {...errorText(graphUris)} fullWidth />
      </div>
      <br />
      <RaisedButton label="Analyze" onTouchTap={handleSubmit} primary disabled={submitting} />
    </form>
  );
};

const validate = makeValidator({
  properties: {
    url: {
      allowEmpty: false,
      message: 'Please specify an endpoint'
    },
    graphUris: {
      allowEmpty: false,
      message: 'Please specify at least one graph URI'
    }
  }
});

export default reduxForm({
  form: 'select-sources',
  fields: ['url', 'graphUris'],
  validate
})(SelectSourcesForm);
