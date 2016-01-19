import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {RouteHandler, Link} from 'react-router'
import { routeActions } from 'redux-simple-router'

import AppBar from '../../../../../node_modules/material-ui/lib/app-bar'
import IconButton from '../../../../../node_modules/material-ui/lib/icon-button'
import NavigationClose from '../../../../../node_modules/material-ui/lib/svg-icons/navigation/close'
import IconMenu from '../../../../../node_modules/material-ui/lib/menus/icon-menu'
import MoreVertIcon from '../../../../../node_modules/material-ui/lib/svg-icons/navigation/more-vert'
import MenuItem from '../../../../../node_modules/material-ui/lib/menus/menu-item'

import {Grid, Row, Col} from 'react-flexbox-grid'

class App extends Component {
  render() {
    const { dispatch } = this.props;
    return (
      <div>
        <AppBar
          title="Payola-viz Application Generator"
          iconElementLeft={<span />}
          iconElementRight={
            <IconMenu
              iconButtonElement={ <IconButton><MoreVertIcon /></IconButton> }
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
              <MenuItem primaryText="Sign up" onTouchTap={() => dispatch(routeActions.push('/appgen/signup'))} />
              <MenuItem primaryText="Sign in" />
            </IconMenu> } />

        {this.props.children}
      </div> )
  }
}

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node
}

export default connect(state => state)(App)
