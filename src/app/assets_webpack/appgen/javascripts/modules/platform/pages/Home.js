import React, { Component } from 'react'
import Helmet from 'react-helmet'
import { Grid,  Row, Col } from 'react-flexbox-grid'
import PaperCard from '../../../components/PaperCard'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import LatestPublishedApps from '../containers/LatestPublishedApps'
import Userbox from '../components/Userbox'

const Home = () =>
  <NarrowedLayout>
    <Helmet title="LDVMi Application Generator" titleTemplate="%s" />
    <Headline title="LDVMi Application Generator" icon="explore" />
    <Grid>
      <Row>
        <Col md={6}>
          <PaperCard title="About" subtitle="LDVMi Application Generator">
            <div>This generator lets you create interactive apps based on linked RDF data!</div>
            <p><strong>Check out the latest published applications:</strong></p>
            <LatestPublishedApps />
          </PaperCard>
        </Col>
        <Col md={6}>
          <Userbox />
        </Col>
      </Row>
    </Grid>
  </NarrowedLayout>;

export default Home;
