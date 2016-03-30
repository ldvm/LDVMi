import React, { Component, PropTypes } from 'react'
import * as theme from '../../../../misc/theme'
import materialTheme from '../../../../misc/materialTheme'
import IconButton from '../../../../components/IconButton'

const headerStyle = {
  backgroundColor: theme.primary,
  color: 'white',
  textAlign: 'center',
  textTransform: 'uppercase',
  fontSize: '14px',
  fontWeight: 500,
  padding: materialTheme.spacing.desktopGutterLess + 'px',
  position: 'relative'
};

const iconStyle = {
  position: 'absolute',
  left: 0,
  top: 0
};

class ExpandableFilters extends Component {
  constructor() {
    super();

    this.state = {
      expanded: false
    }
  }

  toggleExpanded() {
    this.setState({
      expanded: !this.state.expanded
    });
  }

  renderHeader(expandable, expanded) {
    const style = Object.assign({}, headerStyle, expandable ? { cursor: 'pointer '} : {});

    return <div style={style} onClick={() => this.toggleExpanded()} >
        {expandable && this.renderExpandButton(expanded)}
        Available filters
      </div>
  }

  renderExpandButton(expanded) {
    return <IconButton
      icon={expanded ? 'expand_less' : 'expand_more'}
      style={iconStyle}
      iconStyle={{ color: 'white '}}
      onTouchTap={() => this.toggleExpanded()}
    />
  }

  render() {
    const { expandable } = this.props;
    const { expanded } = this.state;

    return <div>
      {this.renderHeader(expandable, expanded)}
      <div style={{ display: (!expandable || expanded) ? 'block' : 'none' }}>
        {this.props.children}
      </div>
    </div>
  }
}

export default ExpandableFilters;