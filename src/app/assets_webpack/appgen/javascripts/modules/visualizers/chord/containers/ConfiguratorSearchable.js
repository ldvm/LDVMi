import React, { PropTypes } from 'react'
import { OrderedMap } from 'immutable'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import Sidebar from '../components/Sidebar'
import { listsSelector } from '../ducks/lists'
import Visualization from './Visualization'
import SampleVisualization from './SampleVisualization'

const ConfiguratorSearchable = ({ lists }) => {
  return (
    <Layout
      sidebar={<Sidebar />}
      toolbar={<Toolbar />}
      visualization={lists.size > 0 ? <Visualization /> : <SampleVisualization />}
    />
  );
};

ConfiguratorSearchable.propTypes = {
  lists: PropTypes.instanceOf(OrderedMap)
};

const selector = createStructuredSelector({
  lists: listsSelector
});

export default connect(selector)(ConfiguratorSearchable);
