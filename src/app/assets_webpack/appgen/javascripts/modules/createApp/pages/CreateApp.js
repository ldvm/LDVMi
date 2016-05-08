import React from 'react'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'
import requireSignedIn from '../../auth/containers/requireSignedIn'

const CreateApp = ({ children }) =>
  <NarrowedLayout>
    <Headline title="Create new application" icon="add_box" />
    {children}
  </NarrowedLayout>;

export default requireSignedIn(CreateApp);
