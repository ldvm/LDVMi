import React, { PropTypes } from 'react'
import Paper from 'material-ui/Paper'
import MaterialTheme from '../../../misc/materialTheme'
import Icon from '../../../components/Icon'
import Padding from '../../../components/Padding'
import ClearBoth from '../../../components/ClearBoth'
import makePureRender from '../../../misc/makePureRender'
import { Application } from '../../app/models'
import { Visualizer } from '../../core/models'
import * as applicationRoutes from '../../app/applicationRoutes'

const cardStyle = {
  marginBottom: MaterialTheme.spacing.desktopGutterLess + 'px',
};

const iconContainerStyle = {
  float: 'left',
  width: '20%̈́'
};

const iconStyle = {
  height: '2.3em',
  width: '2.3em',
  margin: '0.18em 0 0 0.5em'
};

const appContainerStyle = {
  float: 'right',
  width: '80%',
  minHeight: '70px'
};

const h3Style = {
  margin: 0,
  marginBottom: '0.1em',
  fontSize: '1.32em',
};

const linkStyle = {
  textDecoration: 'none'
};

const visualizerStyle = {
  fontSize: '1em'
};

const descriptionStyle = {
  color: '#9e9e9e',
  fontSize: '0.95em'
};

const PublishedAppCard = ({ application, visualizer, deleteApplication, dialogOpen }) => (
  <Paper style={cardStyle}>
    <Padding space={2}>
      <div style={iconContainerStyle}>
        <Icon icon={visualizer.icon} style={iconStyle} color="#333333" />
      </div>
      <div style={appContainerStyle}>
        <h3 style={h3Style}>
          <a href={applicationRoutes.applicationUrl(application)} style={linkStyle}>
            {application.name}
          </a>
        </h3>
        <div style={visualizerStyle}>{visualizer.title}</div>
        <div style={descriptionStyle}>{application.description}</div>
      </div>
      <ClearBoth />
    </Padding>
  </Paper>
);

PublishedAppCard.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  visualizer: PropTypes.instanceOf(Visualizer).isRequired
};

export default makePureRender(PublishedAppCard);
