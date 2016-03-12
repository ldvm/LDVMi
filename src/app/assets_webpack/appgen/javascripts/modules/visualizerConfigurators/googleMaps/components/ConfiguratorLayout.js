import React, { PropTypes } from 'react'
import { Row, Col } from 'react-flexbox-grid'
import { Application } from '../../../manageApp/models'
import Sidebar from '../containers/Sidebar'
import FillInScreen from '../../../../misc/components/FillInScreen'
import BodyPadding from '../../../../misc/components/BodyPadding'
import MapContainer from '../containers/MapContainer'

const wrapperStyle = {
  position: 'relative',
  width: '100%'
};
const sidebarStyle = {
  width: '450px',
  position: 'absolute',
  zIndex: 3
};

const mapStyle = {
  width: '100%',
  position: 'absolute',
  zIndex: 2
};

const ConfiguratorLayout = ({ application }) => {
  return <div style={wrapperStyle}>
    <div style={sidebarStyle}>
      <BodyPadding>
        <Sidebar application={application} />
      </BodyPadding>
    </div>
    <div style={mapStyle}>
      <FillInScreen forceFill={true}>
        <MapContainer />
      </FillInScreen>
    </div>
  </div>;
};

ConfiguratorLayout.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired
};

export default ConfiguratorLayout;
