import React from 'react'
import TextField from 'material-ui/TextField';
import { Row, Col } from 'react-flexbox-grid'
import Button from '../../../../components/Button'
import LanguageAutoComplete from './LanguageAutoComplete'

const VariantFromRow = ({ label, lang, remove }) => {
  return (
    <Row>
      <Col md={7}>
        <TextField floatingLabelText="Label" {...label} fullWidth />
      </Col>
      <Col md={2}>
        <LanguageAutoComplete floatingLabelText="Language" {...lang} fullWidth/>
      </Col>
      <Col md={3}>
        <br />
        <Button label="Remove" raised danger icon="remove_circle" onTouchTap={remove} />
      </Col>
    </Row>
  )
};

export default VariantFromRow;
