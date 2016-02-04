import React, { Component } from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import Table from '../../../../../../../node_modules/material-ui/lib/table/table';
import TableHeaderColumn from '../../../../../../../node_modules/material-ui/lib/table/table-header-column';
import TableRow from '../../../../../../../node_modules/material-ui/lib/table/table-row';
import TableHeader from '../../../../../../../node_modules/material-ui/lib/table/table-header';
import TableRowColumn from '../../../../../../../node_modules/material-ui/lib/table/table-row-column';
import TableBody from '../../../../../../../node_modules/material-ui/lib/table/table-body';
import LinearProgress from '../../../../../../../node_modules/material-ui/lib/linear-progress'
import RaisedButton from '../../../../../../../node_modules/material-ui/lib/raised-button'
import PaperCard from '../../../misc/components/PaperCard'

const Pipelines = (props) => {
  const { error, isLoading, data } = props;
  return (
    <PaperCard
      title="2. Discovered pipelines"
      subtitle="Blah blah blah...">

      {isLoading && <LinearProgress mode="indeterminate"/>}
      {error && error != "" && <p>{error}</p>}

      {data.length > 0 &&
        <Table>
          <TableBody>
            {data.map(pipeline =>
              <TableRow key={pipeline.id}>
                <TableRowColumn>
                  <Link to={"/discovery/pipeline/" + pipeline.id}>
                    {pipeline.title}
                  </Link>
                </TableRowColumn>
                <TableRowColumn>(id: {pipeline.id})</TableRowColumn>
              </TableRow>
            )}
          </TableBody>
        </Table> }
    </PaperCard>
  )
};

export default connect(state => state.discovery.pipelines.toJS())(Pipelines);
