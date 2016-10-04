import React from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'
import BodyPadding from './BodyPadding'

const NarrowedLayout =  ({ children }) =>
  <BodyPadding>
    <Grid>
      <Row>
        <Col lg={12}>
          {children}
        </Col>
      </Row>
    </Grid>
  </BodyPadding>;

export default NarrowedLayout;
