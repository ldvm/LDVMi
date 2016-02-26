import React from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'

const NarrowedLayout =  ({children}) =>
  <Grid>
    <Row>
      <Col lg={12}>
        {children}
      </Col>
    </Row>
  </Grid>;

export default NarrowedLayout;
