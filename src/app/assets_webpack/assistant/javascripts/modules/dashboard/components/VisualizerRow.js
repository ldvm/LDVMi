import React, { PropTypes } from 'react'
import TableRow from 'material-ui/Table/TableRow';
import TableRowColumn from 'material-ui/Table/TableRowColumn';
import IconButton from '../../../components/IconButton'
import makePureRender from '../../../misc/makePureRender'
import withDialogControls from '../../core/containers/withDialogControls'
import ConfirmDialog from '../../core/containers/ConfirmDialog'
import TitleLink from './TitleLink'
import * as theme from '../../../misc/theme'
import Icon from '../../../components/Icon'
import { Visualizer } from '../../core/models'

const confirmDialogName = id => 'DELETE_VISUALIZER_CONFIRM_DIALOG_' + id;

const VisualizerRow = ({ visualizer, editVisualizer, deleteVisualizer, dialogOpen }) => (
  <TableRow>
    <TableRowColumn style={{ width: '5%' }}>
      <Icon icon={visualizer.icon || 'help'} color="#333333" />
    </TableRowColumn>
    <TableRowColumn style={{ width: '40%' }}>
      <TitleLink to="#" onClick={e => { e.preventDefault(); editVisualizer(); }}>
        {visualizer.title}
      </TitleLink>
    </TableRowColumn>
    <TableRowColumn>{visualizer.name}</TableRowColumn>
    <TableRowColumn>
      {!visualizer.disabled && <Icon icon="done" color={theme.success} />}
    </TableRowColumn>
    <TableRowColumn style={{ width: '10%' }}>
      <ConfirmDialog danger
        dialogName={confirmDialogName(visualizer.id)}
        message={`Do you really wish to delete the visualizer ${visualizer.title}?`}
        action={deleteVisualizer}
        icon="delete"
      />
      <IconButton
        icon="delete"
        onTouchTap={() => dialogOpen(confirmDialogName(visualizer.id))}
      />
    </TableRowColumn>
  </TableRow>
);

VisualizerRow.propTypes = {
  visualizer: PropTypes.instanceOf(Visualizer).isRequired,
  editVisualizer: PropTypes.func.isRequired,
  deleteVisualizer: PropTypes.func.isRequired,
  dialogOpen: PropTypes.func.isRequired
};

export default withDialogControls(makePureRender(VisualizerRow));
