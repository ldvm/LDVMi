import React from 'react'
import Layout from '../components/Layout'
import ListsManagerContainer from './ListsManagerContainer'
import Toolbar from '../components/Toolbar'

const ConfiguratorSearchable = () => {
  return (
    <Layout
      sidebar={<ListsManagerContainer />}
      toolbar={<Toolbar />}
      visualization={<div>visualization</div>} />
  );
};

export default ConfiguratorSearchable;
