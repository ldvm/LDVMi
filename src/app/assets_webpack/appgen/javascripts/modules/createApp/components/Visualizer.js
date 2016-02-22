import React, { PropTypes } from 'react'
import { Col } from 'react-flexbox-grid'
import Card from 'material-ui/lib/card/card';
import CardHeader from 'material-ui/lib/card/card-header';
import CardText from 'material-ui/lib/card/card-text';
import CardActions from 'material-ui/lib/card/card-actions';
import FontIcon from 'material-ui/lib/font-icon';
import Button from '../../../misc/components/Button'
import { VisualizerWithPipelines } from '../models'
import MaterialTheme from '../../../misc/materialTheme';
import ShowPipelinesDialog from '../dialogs/ShowPipelinesDialog'

const cardStyle = {
  marginBottom: MaterialTheme.spacing.desktopGutterLess + 'px'
};

const iconStyle = {
  fontSize: '100px',
  width: '100px',
  overflow: 'hidden',
  margin: '0 auto',
  display: 'block',
  color: 'rgba(0, 0, 0, 0.7)'
};

const Visualizer = ({ visualizer, dialogOpen, dialogClose }) => {
  const dialogInstanceName = ShowPipelinesDialog + '_' + visualizer.id;

  return <Col md={3}>
    <Card style={cardStyle}>
      <CardHeader
        title={visualizer.title}
        subtitle={visualizer.pipelines.size + ' discovered pipeline(s)'}
      />
      <CardText>
        <FontIcon className="material-icons" style={iconStyle}>{visualizer.icon}</FontIcon>
        <p>{visualizer.description}</p>
      </CardText>
      <CardActions>
        <Button
          label="Show pipelines"
          onTouchTap={() => dialogOpen(dialogInstanceName)}
          primary raised fullWidth
        />
        <ShowPipelinesDialog
          dialogInstanceName={dialogInstanceName}
          dialogClose={dialogClose}
          pipelines={visualizer.pipelines} />
      </CardActions>
    </Card>
    </Col>
};

Visualizer.propTypes = {
  visualizer: PropTypes.instanceOf(VisualizerWithPipelines).isRequired,
  dialogOpen: PropTypes.func.isRequired,
  dialogClose: PropTypes.func.isRequired
};

export default Visualizer;
