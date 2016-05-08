import React from 'react'
import NarrowedLayout from '../../../components/NarrowedLayout'
import Headline from '../../../components/Headline'

const CreateApp = ({ children }) =>
  <NarrowedLayout>
    <Headline title="Create new application" icon="add_box" />
    {children}
  </NarrowedLayout>;

export default CreateApp;
