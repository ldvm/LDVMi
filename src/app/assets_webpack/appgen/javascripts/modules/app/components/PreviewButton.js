import React, { PropTypes } from 'react'
import { Application } from '../models'
import Button from '../../../components/Button'
import { applicationUrl } from '../../app/applicationRoutes'

const PreviewButton = ({ application }) => {
  const href = applicationUrl(application);
  const icon = application.published ? 'open_in_browser' : 'find_in_page';
  const label = application.published ? 'Open app' : 'Preview';

  return <Button
    label={label} icon={icon}
    raised linkButton={true}
    href={href} target="_blank" />;
};

PreviewButton.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired
};

export default PreviewButton;
