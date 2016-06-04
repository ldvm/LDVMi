import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Helmet from 'react-helmet'
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import Paper from 'material-ui/Paper';
import { routeActions } from 'redux-simple-router'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import PullRight from '../../../components/PullRight'
import Button from '../../../components/Button'
import requireSignedIn from '../../auth/containers/requireSignedIn'
import * as dashboardRoutes from '../routes'
import * as createAppRoutes from '../../createApp/routes'

/**
 * Re-construct the default URL of currently selected tab.
 *
 * A tab is considered active (and should be marked as such) if the URL by which it is uniquely
 * identified is a prefix of the current URL. Unfortunately, the Material UI tabs API won't
 * allow us to define such logic (which is probably a good thing). Therefore we need to apply
 * a reversed approach. We will rebuild the default tab URL from the currently active routes which
 * are injected to this component by the router.
 *
 * TODO: turn this into a universal re-usable and less hacky solution
 *
 * @param route - the active route for this component (parent route of our tab routes)
 * @param routes - all currently active routes
 * @returns {string} default tab URL
 */
function makeTabUrl(route, routes) {
  const routeIndex = routes.indexOf(route);
  if (routeIndex === -1) {
    throw new Error('Route not found!');
  }

  let url = '';
  // Take all routes up to the current route, plus one extra, which is the selected tab route.
  // Ignore the rest.
  for (let i = 0; i <= routeIndex + 1; i++) {
    url += routes[i].path ? '/' + routes[i].path : '';
  }
  return url
    .replace(/\/+/, '/')
    .replace(/[\(:].+$/, '') // Remove optional parts/params of the uri (hack hack hack hack hack....)
    .replace(/\/$/, '');
}

const Dashboard = ({ dispatch, children, route, routes }) =>
  <NarrowedLayout>
    <PullRight>
      <br />
      <Link to={createAppRoutes.createAppUrl()}>
        <Button raised success fullWidth icon="add" label="Create application" />
      </Link>
    </PullRight>

    <Helmet title="Dashboard" />
    <Headline title="Dashboard" icon="dashboard" />

    <Paper>
      <Tabs
        inkBarStyle={{ backgroundColor: 'white' }}
        value={makeTabUrl(route, routes)}
        onChange={url => dispatch(routeActions.push(url))}
      >
        <Tab label="Applications" value={dashboardRoutes.applicationsUrl()} />
        <Tab label="Discoveries" value={dashboardRoutes.discoveriesUrl()} />
        <Tab label="Data sources" value={dashboardRoutes.dataSourcesUrl()} />
        <Tab label="Visualizers" value={dashboardRoutes.visualizersUrl()} />
      </Tabs>

      {children}
    </Paper>
  </NarrowedLayout>;

export default requireSignedIn(connect()(Dashboard));
