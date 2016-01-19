import React, {Component} from 'react'
import {Grid, Row, Col} from 'react-flexbox-grid'

export default class Home extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col md={12} lg={6}><h1>Home!</h1></Col>
          <Col md={12} lg={6}>Ups: Second column</Col>
        </Row>
      </Grid>
    );
  }
}
