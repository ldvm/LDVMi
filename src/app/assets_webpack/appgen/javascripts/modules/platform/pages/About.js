import React, { Component } from 'react'
import Paper from 'material-ui/Paper'
import Helmet from 'react-helmet'
import { Grid,  Row, Col } from 'react-flexbox-grid'
import Padding from '../../../components/Padding'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import AboutSharedInfo from '../components/AboutSharedInfo'

const About = () =>
  <NarrowedLayout>
    <Helmet title="About" />
    <Headline title="About" icon="info" />

    <Grid>
      <Row>
        <Col md={6}>
          <Paper>
            <Padding space={2}>
              <AboutSharedInfo />
              <p>This project has been developed by <a href="mailto:tobiaspotocek@gmail.com">
              Tobiáš Potoček</a> as his master thesis under the supervision
              of <a href="mailto:jiri@helmich.cz">Jiří Helmich</a>, one of the original
              authors of LinkedPipes.</p>
              <p><strong>Related links</strong></p>
              <ul>
                <li>
                  <a href="https://github.com/tobice/LDVMi">Application Generator on GitHub</a> (
                  <a href="https://github.com/tobice/LDVMi/issues">issues</a>). This repository
                  is just a fork of the LinkedPipes Visualization project. The generator might
                  get merged in the future.
                </li>
                <li>
                  <a href="https://github.com/ldvm/LDVMi">LinkedPipes Visualization on GitHub</a>
                </li>
                <li>
                  <a href="http://linkedpipes.com/">LinkedPipes project</a>
                </li>
              </ul>
            </Padding>
          </Paper>
        </Col>
      </Row>
    </Grid>
  </NarrowedLayout>;

export default About;
