import React from 'react';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import FontIcon from 'material-ui/lib/font-icon';
import NavigationExpandMoreIcon from 'material-ui/lib/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import Toolbar from 'material-ui/lib/toolbar/toolbar';
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group';
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator';
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title';
import Button from '../../../../misc/components/Button'

// To vertically center the button on toolbar
const Padding = ({ children }) => <div style={{ margin: '10px 0 '}}>{children}</div>;

const ConfiguratorToolbar = () => (
  <Toolbar>
    <ToolbarGroup float="left">
      <ToolbarTitle text="Average amount of pensions" />
      <IconMenu style={{ marginTop: '5px' }} iconButtonElement={
          <IconButton touch={true}>
            <NavigationExpandMoreIcon />
          </IconButton> }>
        <MenuItem primaryText="Monthly pensions" />
        <MenuItem primaryText="Average salaries" />
      </IconMenu>
    </ToolbarGroup>
    <ToolbarGroup float="left">
      <Padding>
        <Button label="Embed" icon="extension" />
        <Button label="Preview" icon="find_in_page" />
        <Button label="Delete" icon="delete" danger secondary />
      </Padding>
    </ToolbarGroup>
    <ToolbarGroup float="right">
      <Padding>
        <Button label="Add visualization" icon="add" raised success />
        <Button label="Manage layout" icon="view_quilt" raised />
      </Padding>
    </ToolbarGroup>
  </Toolbar>
);

export default ConfiguratorToolbar;
