import React from 'react';
import { reduxForm } from 'redux-form'
import { makeValidator, errorTextFactory } from '../../../misc/formUtils'
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Checkbox from '../../../components/Checkbox'
import Button from '../../../components/Button'
import Dialog from '../../core/containers/Dialog'
import prefix from '../prefix'

export const dialogName = prefix('EDIT_VISUALIZER_DIALOG');
export const formName = prefix('edit-visualizer-source');

const EditVisualizerDialog = props => {
  const { fields: { visualizationUri, priority, name, icon, disabled } } = props;
  const { dialogClose, handleSubmit, submitting, submitFailed } = props;
  const { availableVisualizerNames } = props;

  const errorText = errorTextFactory(submitFailed);

  const actions = [
    <Button label="Cancel"
      onTouchTap={() => dialogClose(dialogName)} />,
    <Button label="Save" success raised disabled={submitting}
      onTouchTap={handleSubmit} />
  ];

  return (
    <Dialog name={dialogName} title="Edit visualizer" actions={actions}>
      <form onSubmit={handleSubmit} className={props.className}>
        <div>
          <TextField
            floatingLabelText="Visualization URI"
            hintText="Target URL where LinkedPipes visualizer lives"
            {...visualizationUri}
            {...errorText(visualizationUri)}
            fullWidth
          />
          <TextField
            floatingLabelText="Priority"
            hintText="Priority used when deciding which visualizer should be chosen for the user"
            {...priority}
            {...errorText(priority)}
            fullWidth
          />
          <br /><br />
          <div><strong style={{ color: 'black' }}>Application Generator related configuration</strong></div>
          <SelectField fullWidth
            floatingLabelText="Name"
            floatingLabelFixed={true}
            hintText="Name of the bundle and corresponding JavaScript module"
            {...name}
            {...errorText(name)}
            onChange={(event, index, value) => name.onChange(value)}
          >
            <MenuItem value="" primaryText="(none)" />
            {availableVisualizerNames.map(n =>
              <MenuItem value={n} primaryText={n} key={n} />
            )}
          </SelectField>
          <TextField
            floatingLabelText="Visualizer icon"
            hintText="Material icon name (use underscores instead of spaces)"
            {...icon}
            {...errorText(icon)}
            fullWidth
          />
          <br /><br />
          <Checkbox label="Disable this visualizer (it will not show in the discovery results)" {...disabled} />
        </div>
      </form>
    </Dialog>
  );
};

const validate = makeValidator({
  properties: {
    priority: {
      pattern: /^[0-9].$/,
      message: 'Please fill in a numeric value'
    }
  }
});

export default reduxForm({
  form: formName,
  fields: ['visualizationUri', 'priority', 'name', 'icon', 'disabled'],
  validate
})(EditVisualizerDialog);
