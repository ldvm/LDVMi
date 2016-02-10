import React from 'react';
import MaterialCheckbox from 'material-ui/lib/checkbox';

export default (props) => {
  let newProps = Object.assign({}, props, {
    value: null,
    checked: props.value,
    onCheck: (e, checked) => props.onChange(checked)
  });
  return <MaterialCheckbox {...newProps} />
};
