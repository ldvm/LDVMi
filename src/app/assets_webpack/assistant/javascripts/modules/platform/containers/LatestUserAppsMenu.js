import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import { List } from 'immutable'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import Divider from 'material-ui/Divider'
import MenuItem from 'material-ui/MenuItem'
import IconMenu from 'material-ui/IconMenu'
import Button from '../../../components/Button'
import { getLatestUserApps, getLatestUserAppsReset, latestUserAppsSelector, latestUserAppsStatusSelector } from '../ducks/latestUserApps'
import { PromiseStatus } from '../../core/models'
import { applicationUrl } from '../../app/configuratorRoutes'
import * as dashboardRoutes from '../../dashboard/routes'
import * as createAppRoutes from '../../createApp/routes'

// Styles in container... eh... we're running out of time :(
const buttonPositioning = {
  targetOrigin: { horizontal: 'right', vertical: 'top' },
  anchorOrigin: { horizontal: 'right', vertical: 'bottom' }
};

const noDecorationStyle = {
  textDecoration: 'none'
};

class LatestUserApps extends Component {
  static propTypes = {
    latestUserApps: PropTypes.instanceOf(List).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getLatestUserApps());
  }
  
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getLatestUserAppsReset());
  }

  render() {
    const { status, latestUserApps } = this.props;

    return  (
      <IconMenu {...buttonPositioning} iconButtonElement={<Button label="My views" inverted />}>
        <Link to={createAppRoutes.createAppUrl()} style={noDecorationStyle}>
          <MenuItem primaryText="Create a new view" />
        </Link>
        <Divider />

        {status.done && latestUserApps.size > 0 && (
          <div>
            {latestUserApps.map(app =>
              <Link to={applicationUrl(app.id)} key={app.id} style={noDecorationStyle}>
                <MenuItem primaryText={app.name} />
              </Link>
            )}
            <Divider />
          </div>
        )}
        
        <Link to={dashboardRoutes.dashboardUrl()} style={noDecorationStyle}>
          <MenuItem primaryText="All views" />
        </Link>
      </IconMenu> 
    );
  }
}

const selector = createStructuredSelector({
  latestUserApps: latestUserAppsSelector,
  status: latestUserAppsStatusSelector
});

export default connect(selector)(LatestUserApps);
