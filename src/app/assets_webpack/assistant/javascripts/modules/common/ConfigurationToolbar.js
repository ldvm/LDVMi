import React, {Component, PropTypes} from "react";
import Drawer from "material-ui/Drawer";
import {AppBar, IconButton, RaisedButton, Tab, Tabs} from "material-ui";
import {NavigationClose} from "material-ui/svg-icons/index";

export default class ConfigurationToolbar extends Component {
    static propTypes = {
        label: PropTypes.string.isRequired,
        children: PropTypes.instanceOf(Map).isRequired
    };

    changeOpen() {
        this.open = !this.open;
        this.forceUpdate();
    }

    componentWillMount() {
        this.open = false;
    }

    render() {
        const {children, label} = this.props;

        // Tabs
        let tabs = [];
        if (children.size > 0) {
            for (const [label, value] of children) {
                tabs.push(<Tab key={label} label={label}>{value}</Tab>)
            }
        }

        // Close icon
        let appBarIcon = <IconButton onTouchTap={() => this.changeOpen()}>
            <NavigationClose/>
        </IconButton>

        // Drawer bug - if width is set, component ignores open property
        let width = "0%";
        if (this.open) width = "40%";

        // Rendering
        return (
            <div>
                <RaisedButton
                    label={label}
                    primary={true}
                    onTouchTap={() => this.changeOpen()}
                />
                <Drawer open={this.open} width={width}>
                    <AppBar
                        title={label}
                        iconElementLeft={appBarIcon}
                        onTitleTouchTap={() => this.changeOpen()}
                    />
                    <Tabs>
                        {tabs}
                    </Tabs>
                </Drawer>
            </div>
        );
    }
}