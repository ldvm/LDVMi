import React, { PropTypes } from 'react'
import { List } from 'immutable'
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import Paper from 'material-ui/lib/paper';
import RefreshMapButton from '../containers/RefreshMapButton'
import FillInScreen from '../../../../misc/components/FillInScreen'
import Button from '../../../../misc/components/Button'
import Padding from '../../../../misc/components/Padding'
import FilterConfig from '../containers/FilterConfig'
import FilterPreview from '../containers/FilterPreview'
import { Application } from '../../../manageApp/models'

const SidebarTabs = ({ application, filters }) => {

  return <Paper zDepth={2}>
    <Tabs inkBarStyle={{ backgroundColor: 'white' }}>
      <Tab label="Configure">
        <FillInScreen marginBottom={100}>
          <div>
            {filters.map(filter =>
              <div key={filter.property.uri}>
                <FilterConfig filter={filter} />
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
            {filters.map(filter =>
              <div key={filter.property.uri}>
                <FilterPreview filter={filter} />
              </div>
            )}
          </div>
        </FillInScreen>
        <Padding space={2}>
          <RefreshMapButton application={application} />
        </Padding>
      </Tab>
    </Tabs>
  </Paper>
};

SidebarTabs.propTypes = {
  application: PropTypes.instanceOf(Application).isRequired,
  filters: PropTypes.instanceOf(List)
};

export default SidebarTabs;
