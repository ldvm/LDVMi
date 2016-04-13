import React, { PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'

const wrapperStyle = {
  position: 'relative',
  width: '100%'
};
const sidebarStyle = {
  width: '400px',
  position: 'absolute',
  zIndex: 3
};

const toolbarStyle = {
  position: 'absolute',
  right: 0,
  zIndex: 3
};

const visualizationStyle = {
  width: '100%',
  position: 'absolute',
  marginLeft: '400px',
  zIndex: 2
};

const Layout = ({ sidebar, toolbar, visualization }) => {
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
