import React, { PropTypes } from 'react'
import { bodyPaddingSpace } from '../../../../components/BodyPadding'

const sidebarWidth = 400;

const wrapperStyle = {
  position: 'relative',
  width: '100%'
};

const sidebarStyle = {
  width: sidebarWidth + 'px',
  position: 'absolute',
  zIndex: 3
};

const toolbarStyle = {
  position: 'absolute',
  right: 0,
  zIndex: 3
};

const baseVisualizationStyle = {
  width: '100%',
  position: 'absolute',
  boxSizing: 'border-box',
  zIndex: 2
};

const Layout = ({ sidebar, toolbar, visualization }) => {
  const visualizationStyle = Object.assign({}, baseVisualizationStyle,
    toolbar ? { paddingTop: 2 * bodyPaddingSpace + 'px' } : {},
    sidebar ? { paddingLeft: sidebarWidth + bodyPaddingSpace + 'px' } : {},
  );
  return <div style={wrapperStyle}>
      {sidebar && <div style={sidebarStyle}>
        {sidebar}
      </div>}

      {toolbar && <div style={toolbarStyle}>
        {toolbar}
      </div>}

      <div style={visualizationStyle}>
        {visualization}
      </div>
  </div>;
};

Layout.propTypes = {
  sidebar: PropTypes.node,
  toolbar: PropTypes.node,
  visualization: PropTypes.node
};

export default Layout;
