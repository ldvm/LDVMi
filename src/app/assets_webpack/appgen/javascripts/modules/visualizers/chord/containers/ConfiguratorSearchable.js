import React from 'react'
import Layout from '../components/Layout'
import Toolbar from '../components/Toolbar'
import Sidebar from '../components/Sidebar'

const ConfiguratorSearchable = () => {
  return (
    <Layout
      sidebar={<Sidebar />}
      toolbar={<Toolbar />}
      visualization={<div>visualization</div>} />
  );
};

export default ConfiguratorSearchable;
