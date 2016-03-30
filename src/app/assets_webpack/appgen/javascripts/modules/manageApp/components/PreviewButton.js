import React, { PropTypes } from 'react'
import { Application } from '../models'
import Button from '../../../components/Button'

const PreviewButton = ({ application: { id, uid, published } }) => {
  const href = '/app/' + id + '/' + uid; // TODO: find a better way to do this
  const icon = published ? 'open_in_browser' : 'find_in_page';
  const label = published ? 'Open app' : 'Preview';

  return <Button
    label={label} icon={icon}
    raised linkButton={true}
    href={href} target="_blank" />;
};

PreviewButton.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired
};

export default PreviewButton;
