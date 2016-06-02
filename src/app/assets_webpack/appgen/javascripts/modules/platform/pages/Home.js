import React, { Component } from 'react'
import { Link } from 'react-router'
import Helmet from 'react-helmet'
import { Grid,  Row, Col } from 'react-flexbox-grid'
import PaperCard from '../../../components/PaperCard'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import Subheadline from '../../../components/Subheadline'
import LatestPublishedApps from '../containers/LatestPublishedApps'
import Userbox from '../components/Userbox'
import AboutSharedInfo from '../components/AboutSharedInfo'
import * as routes from '../routes'

const Home = () =>
  <NarrowedLayout>
    <Helmet title="Linked Pipes Application Generator" titleTemplate="%s" />
    <Headline title="Linked Pipes Application Generator" icon="explore" />
    <Grid>
      <Row>
        <Col md={6}>
          <PaperCard title="About" subtitle="Linked Pipes Application Generator">
            <AboutSharedInfo />
            <p>
              <Link to={routes.aboutUrl()}>
                <strong>Read more ></strong>
              </Link>
            </p>
          </PaperCard>
        </Col>
        <Col md={6}>
          <Userbox />
        </Col>
      </Row>
    </Grid>
    <Subheadline title="Latest published applications" />
    <LatestPublishedApps />
  </NarrowedLayout>;

export default Home;
