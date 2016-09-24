import React from 'react';
import { reduxForm } from 'redux-form'
import { errorTextFactory } from '../../../misc/formUtils'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Button from '../../../components/Button'
import Dialog from '../../core/containers/Dialog'
import prefix from '../prefix'

export const dialogName = prefix('CREATE_VISUALIZER_DIALOG');
export const formName = prefix('create-visualizer');

const AddVisualizerDialog = (props) =>  {
  const { visualizerComponents, dialogClose, fields: { componentTemplateUri }, handleSubmit, submitting, submitFailed } = props;
  const errorText = errorTextFactory(submitFailed);

  const actions = [
    <Button label="Cancel"
      onTouchTap={() => dialogClose(dialogName)} />,
    <Button label="Add visualizer" success raised disabled={submitting}
      onTouchTap={handleSubmit} />
  ];

  return (
    <Dialog name={dialogName} title="Add visualizer" actions={actions}>
      <form onSubmit={handleSubmit} className={props.className}>
        <div>
          Please select a LDVM visualizer component for which you want to create a new application
          generator visualizer. If your component is not available in the list, make sure you
          added it properly via <a href="/components#/" target="_blank">Linked Pipes interface</a>.
        </div>
        <div>
          <SelectField fullWidth
            floatingLabelText="Visualizer component"
            {...componentTemplateUri}
            {...errorText(componentTemplateUri)}
            onChange={(event, index, value) => componentTemplateUri.onChange(value)}
          >
            {visualizerComponents.map(vc =>
              <MenuItem value={vc.uri} primaryText={vc.title} key={vc.uri} />
            ).toList()}
          </SelectField>
        </div>
      </form>
    </Dialog>
  );
};

export default reduxForm({
  form: formName,
  fields: ['componentTemplateUri']
})(AddVisualizerDialog);
