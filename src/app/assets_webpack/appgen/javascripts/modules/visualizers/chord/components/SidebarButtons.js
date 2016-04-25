import React from 'react'
import Padding from '../../../../components/Padding'
import OpenSearchDialogButton from './OpenSearchDialogButton'
import VisualizeSelectedNodesButton from '../containers/VisualizeSelectedNodesButton'

const SidebarButtons = () => (
  <Padding>
    <div style={{ float: 'left', width: '50% '}}>
      <Padding>
        <OpenSearchDialogButton fullWidth />
      </Padding>
    </div>
    <div style={{ float: 'right', width: '50% '}}>
      <Padding>
        <VisualizeSelectedNodesButton fullWidth />
      </Padding>
    </div>
    <div style={{ clear: 'both '}}></div>
  </Padding>
);

export default SidebarButtons;