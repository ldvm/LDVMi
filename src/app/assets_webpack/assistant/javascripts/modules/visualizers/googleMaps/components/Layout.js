import React, {PropTypes} from "react";
import Paper from "material-ui/Paper";
import FillInScreen from "../../../../components/FillInScreen";
import BodyPadding from "../../../../components/BodyPadding";
import MapContainer from "../containers/MapContainer";

const wrapperStyle = {
    position: 'relative',
    width: '100%'
};
const sidebarStyle = {
    width: '450px',
    position: 'absolute',
    zIndex: 3
};

const toolbarStyle = {
    position: 'absolute',
    right: 0,
    zIndex: 3
};

const mapStyle = {
    width: '100%',
    position: 'absolute',
    zIndex: 2
};

const insetShadowWrapperStyle = {
    width: '100%',
    height: '10px',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 3,
    overflow: 'hidden'
};

const insetShadowStyle = {
    width: '100%',
    height: '20px',
    position: 'relative',
    top: '-20px',
    left: 0,
    zIndex: 3
};

const Layout = ({sidebar, toolbar, insetShadow}) => {
    return <div style={wrapperStyle}>

        {insetShadow && <div style={insetShadowWrapperStyle}>
            <Paper style={insetShadowStyle}/>
        </div>}

        {sidebar && <div style={sidebarStyle}>
            <BodyPadding>
                {sidebar}
            </BodyPadding>
        </div>}

        {toolbar && <div style={toolbarStyle}>
            {toolbar}
        </div>}

        <div style={mapStyle}>
            <FillInScreen forceFill={true}>
                <MapContainer />
            </FillInScreen>
        </div>
    </div>;
};

Layout.propTypes = {
    sidebar: PropTypes.node,
    toolbar: PropTypes.node,
    insetShadow: PropTypes.bool
};

export default Layout;
