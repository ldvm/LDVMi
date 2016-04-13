import React, { PropTypes } from 'react'
import TableRow from 'material-ui/lib/table/table-row'
import TableRowColumn from 'material-ui/lib/table/table-row-column'
import { Lens, ResourceThroughLens } from '../models'
import LocalizedValue from '../../../core/containers/LocalizedValue'

const SearchResultRow = ({ searchableLens, resource }) => {
  return (
    <TableRow>
      {searchableLens.showProperties.map(propertyUri =>
        <TableRowColumn key={propertyUri}>
          <LocalizedValue value={resource.properties.get(propertyUri)} silent />
        </TableRowColumn>
      )}
    </TableRow>
  );
};

SearchResultRow.propTypes = {
  searchableLens: PropTypes.instanceOf(Lens).isRequired,
  resource: PropTypes.instanceOf(ResourceThroughLens).isRequired
};

export default SearchResultRow;
