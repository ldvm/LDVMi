import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import GeneralSettingsDialog, { dialogName} from '../dialogs/GeneralSettingsDialog'
import { dialogClose } from '../../core/ducks/dialog'
import { Application } from '../models'
import { notification } from '../../core/ducks/notifications'
import { updateApplication } from '../ducks/application'
import * as api from '../api'

const GeneralSettings = ({ dispatch, application }) => {

  const handleSubmit = async values => {
    try {
      const result = await api.updateSettings(application.id, values);
      dispatch(notification(result.message));
      dispatch(dialogClose(dialogName));
      dispatch(updateApplication({
        name: values.name,
        description: values.description
      }));
    }
    catch (e) {
      console.log(e);
      dispatch(notification(e.message));
    }
  };

  return <GeneralSettingsDialog
      dialogClose={dialogName => dispatch(dialogClose(dialogName))}
      onSubmit={handleSubmit}
      initialValues={Object.assign({}, application.toJS(), { updateUrl: false })}
    />
};

GeneralSettings.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired
};

export default connect()(GeneralSettings)
