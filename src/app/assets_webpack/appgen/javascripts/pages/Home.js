import React, {Component} from 'react'
import { Link } from 'react-router'
import {Grid, Row, Col} from 'react-flexbox-grid'

export default class Home extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col md={12} lg={6}><h1>Home!</h1></Col>
          <Col md={12} lg={6}>
            <Link to="/signup">Sign up!</Link>
          </Col>
        </Row>
      </Grid>
    );
  }
}
