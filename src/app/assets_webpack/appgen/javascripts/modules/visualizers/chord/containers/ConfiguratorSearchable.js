import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import Sidebar from '../components/Sidebar'
import { selectedListSelector } from '../ducks/selectedList'
import { NodeList } from '../models'
import Visualization from './Visualization'
import SampleVisualization from './SampleVisualization'

const ConfiguratorSearchable = ({ selectedList }) => {
  return (
    <Layout
      sidebar={<Sidebar />}
      toolbar={<Toolbar />}
      visualization={selectedList ? <Visualization /> : <SampleVisualization />}
    />
  );
};

ConfiguratorSearchable.propTypes = {
  selectedList: PropTypes.instanceOf(NodeList)
};

const selector = createStructuredSelector({
  selectedList: selectedListSelector
});

export default connect(selector)(ConfiguratorSearchable);
