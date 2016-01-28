import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'redux-simple-router'

import AppBar from 'material-ui/lib/app-bar'
import IconButton from 'material-ui/lib/icon-button'
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/lib/menus/menu-item'
import FontIcon from 'material-ui/lib/font-icon'
import CircularProgress from 'material-ui/lib/circular-progress'
import {Grid, Row, Col} from 'react-flexbox-grid'

class App extends Component {
  render() {
    const { dispatch, loading } = this.props;
    return (
      <div>
        <AppBar
          className="appbar"
          title={
            <span onTouchTap={() => dispatch(routeActions.push('/'))} className="appbar-logo">
              LDVMi Application Generator
            </span> }
          iconElementLeft={
            <IconButton onTouchTap={() => dispatch(routeActions.push('/'))}>
              <FontIcon className="material-icons">explore</FontIcon>
            </IconButton> }
          iconElementRight={
            <div>
              {loading > 0 && <CircularProgress size={0.5} color="white"
                style={{position: 'absolute', right: '50px'}}
               />}
              <IconMenu
                iconButtonElement={ <IconButton><MoreVertIcon color="white" /></IconButton> }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
                <MenuItem primaryText="Sign up" onTouchTap={() => dispatch(routeActions.push('/signup'))} />
                <MenuItem primaryText="Sign in" onTouchTap={() => dispatch(routeActions.push('/signin'))} />
              </IconMenu>
            </div>} />

        <Grid>
          <Row>
            <Col lg={12}>
              {this.props.children}
            </Col>
          </Row>
        </Grid>

      </div> )
  }
}

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node
};

export default connect(state => state)(App)
