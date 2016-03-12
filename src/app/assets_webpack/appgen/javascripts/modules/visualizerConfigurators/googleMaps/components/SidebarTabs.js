import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';
import PropertyFiltersConfig from '../containers/PropertyFiltersConfig'
import PropertyFilters from '../containers/PropertyFilters'
import FillInScreen from '../../../../misc/components/FillInScreen'
import Button from '../../../../misc/components/Button'
import Padding from '../../../../misc/components/Padding'

const SidebarTabs = ({ properties }) => {
  return <Paper zDepth={2}>
    <Tabs inkBarStyle={{ backgroundColor: 'white' }}>
      <Tab label="Configure">
        <FillInScreen marginBottom={100}>
          <div>
            {properties.map(property =>
              <div key={property.uri}>
                <PropertyFiltersConfig property={property} />
              </div>
            )}
          </div>
        </FillInScreen>
        <Padding space={2}>
          <Button success raised fullWidth icon="done" label="Save changes" />
        </Padding>
      </Tab>
      <Tab label="Preview">
        <FillInScreen marginBottom={100}>
          <div>
            {properties.map(property =>
              <div key={property.uri}>
                <PropertyFilters property={property} />
              </div>
            )}
          </div>
        </FillInScreen>
        <Padding space={2}>
          <Button warning raised fullWidth icon="refresh" label="Refresh map" />
        </Padding>
      </Tab>
    </Tabs>
  </Paper>
};

SidebarTabs.propTypes = {
  properties: PropTypes.instanceOf(List)
};

export default SidebarTabs;
