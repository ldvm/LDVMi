import React, { PropTypes } from 'react'
import Button from '../../../components/Button'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { publishApplication, publishStatusSelector, applicationSelector } from '../ducks/application'
import { Application } from '../models'
import { dialogOpen } from '../../core/ducks/dialog'
import ConfirmDialog from '../../core/containers/ConfirmDialog'
import { PromiseStatus } from "../../core/models";

const PublishButton = ({ dispatch, application: { id, published }, status }) => {
  const dialogName = 'PUBLISH_CONFIRM_DIALOG';
  const publish = () => dispatch(publishApplication(id, !published));
  const confirm = () => dispatch(dialogOpen(dialogName));
  const disabled = status.isLoading;

  const button = published ?
    <Button label="Cancel publication" icon="block" raised warning onTouchTap={confirm} disabled={disabled} /> :
    <Button label="Publish" icon="screen_share" raised success onTouchTap={confirm} disabled={disabled} />;

  const message = !published ?
    'Do you really want to publish this view?' :
    'Do you really want to unpublish this view? It will no longer be accessible.';

  return <span>
    {button}
    <ConfirmDialog dialogName={dialogName} message={message} action={publish} />
  </span>
};

PublishButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  application: PropTypes.instanceOf(Application).isRequired,
  status: PropTypes.instanceOf(PromiseStatus).isRequired
};

const selector = createStructuredSelector({
  application: applicationSelector,
  status: publishStatusSelector
});

export default connect(selector)(PublishButton);
