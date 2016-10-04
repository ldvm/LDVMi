import React, { PropTypes } from 'react'
import { Col } from 'react-flexbox-grid'
import Card from 'material-ui/Card/Card';
import CardHeader from 'material-ui/Card/CardHeader';
import CardText from 'material-ui/Card/CardText';
import CardActions from 'material-ui/Card/CardActions';
import Button from '../../../components/Button'
import Icon from '../../../components/Icon'
import { VisualizerWithPipelines } from '../../core/models'
import MaterialTheme from '../../../misc/materialTheme'
import makePureRender from '../../../misc/makePureRender'

const cardStyle = {
  marginBottom: MaterialTheme.spacing.desktopGutterLess + 'px'
};

const iconStyle = {
  height: '100px',
  width: '100px',
  margin: '0 auto',
  display: 'block'
};

const Visualizer = ({ visualizer, showPipelines }) => {

  return <Col md={3}>
    <Card style={cardStyle}>
      <CardHeader
        title={visualizer.title}
        subtitle={visualizer.pipelines.size + ' discovered pipeline(s)'}
      />
      <CardText>
        <Icon style={iconStyle} icon={visualizer.icon} color="rgba(0, 0, 0, 0.7)" />
        <p>{visualizer.description}</p>
      </CardText>
      <CardActions>
        <Button
          label={visualizer.disabled ? 'Unsupported visualizer' : 'Show pipelines'}
          disabled={visualizer.disabled}
          onTouchTap={() => showPipelines()}
          primary raised fullWidth
        />
      </CardActions>
    </Card>
    </Col>
};

Visualizer.propTypes = {
  visualizer: PropTypes.instanceOf(VisualizerWithPipelines).isRequired,
  showPipelines: PropTypes.func.isRequired
};

export default makePureRender(Visualizer);
