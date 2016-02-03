import React, { Component } from 'react'
import { connect } from 'react-redux'
import Table from 'material-ui/lib/table/table';
import TableHeaderColumn from 'material-ui/lib/table/table-header-column';
import TableRow from 'material-ui/lib/table/table-row';
import TableHeader from 'material-ui/lib/table/table-header';
import TableRowColumn from 'material-ui/lib/table/table-row-column';
import TableBody from 'material-ui/lib/table/table-body';
import LinearProgress from 'material-ui/lib/linear-progress'
import RaisedButton from 'material-ui/lib/raised-button'
import PaperCard from '../misc/components/PaperCard'
import { getPipelines } from '../modules/discovery/actions'

class Pipelines extends Component {
  componentDidMount() {
    const {dispatch, params: {discoveryId}} = this.props;
    dispatch(getPipelines(discoveryId));
  }

  render() {
    const { error, isLoading, pipelines } = this.props;
    return (
      <PaperCard
        title="2. Discovered pipelines"
        subtitle="Blah blah blah...">

        {isLoading && <LinearProgress mode="indeterminate"/>}
        {error && error != "" && <p>{error}</p>}

        {pipelines.length > 0 &&
          <Table>
            <TableBody>
              {pipelines.map(pipeline =>
                <TableRow key={pipeline.id}>
                  <TableRowColumn>{pipeline.title}</TableRowColumn>
                  <TableRowColumn>(id: {pipeline.id})</TableRowColumn>
                </TableRow>
              )}
            </TableBody>
            <br />
          </Table> }
      </PaperCard>
    )
  }
}

export default connect(state => state.pipelines.toJS())(Pipelines);
