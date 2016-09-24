import React, { PropTypes } from 'react'
import { List } from 'immutable';
import Table from 'material-ui/Table/Table';
import TableHeader from 'material-ui/Table/TableHeader';
import TableHeaderColumn from 'material-ui/Table/TableHeaderColumn';
import TableBody from 'material-ui/Table/TableBody';
import TableRow from 'material-ui/Table/TableRow';
import Button from '../../../components/Button'
import Dialog from '../../core/containers/Dialog';
import Pipeline from '../components/Pipeline'
import Pagination from '../../core/containers/Pagination'
import PullLeft from '../../../components/PullLeft'
import IgnoreDialogPadding from '../../../components/IgnoreDialogPadding'
import paginate from '../../core/containers/paginate'
import prefix from '../prefix'

const dialogStyle = {
  width: '1000px',
  maxWidth: '1000px'
};

export const dialogName = prefix('SHOW_PIPELINES_DIALOG');
export const paginatorName = prefix('SHOW_PIPELINES_DIALOG');

const ShowPipelinesDialog = (props) =>  {
  const { dialogClose, runEvaluation, pipelines } = props;

  const actions = [
    <PullLeft>
      <Pagination name={paginatorName} />
    </PullLeft>,
    <Button label="Close" onTouchTap={() => dialogClose(dialogName)} />
  ];

  return (
    <Dialog name={dialogName} title="Select pipeline" actions={actions} modal={false} contentStyle={dialogStyle}>
      <div>Each discovered pipeline presents a sequence of transformation steps that have to be
        applied on the data so that they can be visualized using this visualizer. Note that
        different pipelines will give different outputs. You need to try them manually.</div>
      <p><strong>To create an application, first run a pipeline from the table bellow.</strong></p>
      <IgnoreDialogPadding horizontal>
        <Table selectable={false}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn width={100}>Status</TableHeaderColumn>
              <TableHeaderColumn width={400}>Actions</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} allowMultiselect>
            {pipelines.map(pipeline =>
              <Pipeline pipeline={pipeline} runEvaluation={runEvaluation} key={pipeline.id} />)}
          </TableBody>
        </Table>
      </IgnoreDialogPadding>
    </Dialog>
  );
};

ShowPipelinesDialog.propTypes = {
  pipelines: PropTypes.instanceOf(List).isRequired,
  dialogClose: PropTypes.func.isRequired,
  runEvaluation: PropTypes.func.isRequired
};

export default paginate({
  paginatorName,
  itemsSelector: (_, props) => props.pipelines,
  pageSize: 4,
  pageContentProp: 'pipelines'
}, ShowPipelinesDialog);
