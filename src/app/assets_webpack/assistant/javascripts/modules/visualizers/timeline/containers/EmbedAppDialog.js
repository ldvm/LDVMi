import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Button from '../../../../components/Button'
import Dialog from '../../../core/containers/Dialog'
import prefix from '../prefix'
import withDialogControls from '../../../core/containers/withDialogControls'
import EmbedCodeGenerator from '../../../app/components/EmbedCodeGenerator'
import { applicationUrl } from '../../../app/applicationRoutes'
import { applicationSelector } from '../../../app/ducks/application'
import { Application } from '../../../app/models'
import locationOrigin from '../../../../misc/locationOrigin'

export const dialogName = prefix('EMBED_APP_DIALOG');

function generateUrl(application) {
  return locationOrigin() + applicationUrl(application) + '/embed';
}

class EmbedAppDialog extends Component {

  static propTypes = {
    application: PropTypes.instanceOf(Application).isRequired,
    dialogClose: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { application, dialogClose } = this.props;

    const actions = [
      <Button label="Close" onTouchTap={() => dialogClose(dialogName)}/>
    ];

    return (
      <Dialog name={dialogName} title="Embed application" actions={actions}>
        <EmbedCodeGenerator url={generateUrl(application)}/>
      </Dialog>
    );
  }
}

const selector = createStructuredSelector({
  application: applicationSelector,
});

export default connect(selector)(withDialogControls(EmbedAppDialog));
