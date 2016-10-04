import React, { PropTypes } from 'react'
import { NodeList } from '../models'

const ListHeader = ({ list }) => {
  if (!list) {
    return <span>(No list selected)</span>
  }
  
  return <span>{list.name}</span>
};

ListHeader.propTypes = {
  list: PropTypes.instanceOf(NodeList)
};

export default ListHeader;
