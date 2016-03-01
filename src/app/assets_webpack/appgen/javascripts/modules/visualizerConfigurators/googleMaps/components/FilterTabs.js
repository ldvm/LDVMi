import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import PropertyHeader from './PropertyHeader'

const FilterTabs = ({ properties }) => {
  return <Tabs inkBarStyle={{ backgroundColor: 'white' }}>
      <Tab label="Configure">
        {properties.map(property =>
          <PropertyHeader property={property} />
        )}
      </Tab>
      <Tab label="Preview">
        Preview
      </Tab>
    </Tabs>
};

FilterTabs.propTypes = {
  properties: PropTypes.instanceOf(List)
};

export default FilterTabs;
