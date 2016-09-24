import React, { PropTypes } from 'react'
import { List } from 'immutable'
import { Grid, Row, Col } from 'react-flexbox-grid'
import PublishedAppCard from './PublishedAppCard'
import { Visualizer } from '../../core/models'

// We need to split the applications into rows by 3
function split(collection, segmentSize) {
  return collection.groupBy((value, index) => Math.floor(index / segmentSize)).toList();
}

const PublishedAppsGrid = ({ applications, visualizers }) => (
  <Grid>
    {split(applications, 3).map((row, i) => (
      <Row key={i}>
        {row.map(application => (
          <Col key={application.id} md={4}>
            <PublishedAppCard
              application={application}
              visualizer={visualizers.filter(v => v.componentTemplateId == application.visualizerComponentTemplateId).get(0) || new Visualizer()}
            />
          </Col>
        ))}
      </Row>
    ))}
  </Grid>
);

PublishedAppsGrid.propTypes = {
  applications: PropTypes.instanceOf(List).isRequired,
  visualizers: PropTypes.instanceOf(List).isRequired
};

export default PublishedAppsGrid;
