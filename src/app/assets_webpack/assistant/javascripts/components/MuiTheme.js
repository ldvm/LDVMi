import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import materialTheme from '../misc/materialTheme'

const theme = getMuiTheme(materialTheme);

// Injects custom Material UI theme into the component hierarchy.
const MuiTheme = ({ children }) => (
  <MuiThemeProvider muiTheme={theme}>
    {children}
  </MuiThemeProvider>
);

export default MuiTheme;
