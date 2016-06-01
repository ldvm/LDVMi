import React from 'react';
import MaterialCheckbox from 'material-ui/Checkbox';

export default (props) => {
  let newProps = Object.assign({}, props, {
    value: null,
    checked: props.value,
    onCheck: (e, checked) => props.onChange(checked)
  });
  return <MaterialCheckbox {...newProps} />
};
