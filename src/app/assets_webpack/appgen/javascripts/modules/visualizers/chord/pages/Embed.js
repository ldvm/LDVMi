import React from 'react'
import Application from '../containers/Application'
import ResetBodyBackground from '../../../../components/ResetBodyBackground'

export default ({ params: { listId } }) => (
  <div>
    <Application listId={listId} embed />
    <ResetBodyBackground />
  </div>
);
