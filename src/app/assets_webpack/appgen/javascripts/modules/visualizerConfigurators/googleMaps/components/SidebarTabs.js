import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import PropertyFilters from '../containers/PropertyFilters'
import FillInScreen from '../../../../misc/components/FillInScreen'

const SidebarTabs = ({ properties }) => {
  return <Tabs inkBarStyle={{ backgroundColor: 'white' }}>
    <Tab label="Configure">
      <FillInScreen marginBottom={100}>
        <div>
          {properties.map(property =>
            <div key={property.uri}>
              <PropertyFilters property={property} />
            </div>
          )}
        </div>
      </FillInScreen>
    </Tab>
    <Tab label="Preview">
      <FillInScreen marginBotom={100}>
        <div>Preview</div>
      </FillInScreen>
    </Tab>
  </Tabs>
};

SidebarTabs.propTypes = {
  properties: PropTypes.instanceOf(List)
};

export default SidebarTabs;
