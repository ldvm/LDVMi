import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import PropertyHeader from './PropertyHeader'
import PropertyFilters from '../containers/PropertyFilters'
import FillInScreen from '../../../../misc/components/FillInScreen'

const SidebarTabs = ({ properties }) => {
  return <Tabs inkBarStyle={{ backgroundColor: 'white' }}>
      <Tab label="Configure">
        {properties.map(property =>
          <div>
            <PropertyHeader property={property} />
            <PropertyFilters property={property} />
          </div>
        )}
      </Tab>
      <Tab label="Preview">
        Preview
      </Tab>
    </Tabs>
};

SidebarTabs.propTypes = {
  properties: PropTypes.instanceOf(List)
};

export default SidebarTabs;
