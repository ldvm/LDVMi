import React from 'react'
import Layout from '../components/Layout'
import ListsManagerContainer from './ListsManagerContainer'

const ConfiguratorSearchable = () => {
  return (
    <Layout
      sidebar={<ListsManagerContainer />}
      toolbar={<div>toolbar</div>}
      visualization={<div>visualization</div>} />
  );
};

export default ConfiguratorSearchable;
