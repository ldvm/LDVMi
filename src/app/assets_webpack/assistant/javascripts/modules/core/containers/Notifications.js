import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import Snackbar from 'material-ui/Snackbar';
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { notificationsSelector } from '../../core/ducks/notifications'

const Notifications = ({ notifications }) => {
  return <Snackbar
    open={notifications.size > 0}
    message={notifications.size > 0 ? notifications.last().message : ''}
    onRequestClose={() => null} />
};

Notifications.propTypes = {
  notifications: PropTypes.instanceOf(List).isRequired
};

const selector = createStructuredSelector({
  notifications: notificationsSelector
});

export default connect(selector)(Notifications)
