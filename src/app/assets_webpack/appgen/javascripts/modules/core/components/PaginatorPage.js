import React from 'react';
import Button from '../../../components/Button'

const style = {
  minWidth: '30px'
};

const PaginatorPage = props =>
  <Button raised {...props} style={style}  />;

export default PaginatorPage;
