import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { goTo } from '../misc/routeActions'

import AppBar from 'material-ui/lib/app-bar'
import IconButton from 'material-ui/lib/icon-button'
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/lib/menus/menu-item'

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
              <MenuItem primaryText="Sign up" onTouchTap={() => dispatch(goTo('signup'))} />
              <MenuItem primaryText="Sign in" onTouchTap={() => dispatch(goTo('signin'))} />
            </IconMenu> } />

        {this.props.children}
      </div> )
  }
}

App.propTypes = {
  // Injected by React Router
  children: PropTypes.node
};

export default connect(state => state)(App)
