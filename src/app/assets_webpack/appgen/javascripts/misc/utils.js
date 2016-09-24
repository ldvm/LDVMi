export function arrayToObject(array, extractKey) {
  if (!array instanceof Array) {
    throw new Error('Array expected as first argument.');
  }
  if (!extractKey instanceof Function) {
    throw new Error('Function expected as second argument.');
  }

  let obj = {};
  for (let i = 0; i < array.length; i++) {
    obj[extractKey(array[i])] = array[i];
  }

  return obj;
}

export function getColorType(props) {
  switch (true) {
    case (props.primary): return 'primary';
    case (props.success): return 'success';
    case (props.info): return 'info';
    case (props.warning): return 'warning';
    case (props.danger): return 'danger';
    default: return 'default';
  }
}

export function randomString(length) {
  // http://stackoverflow.com/a/19964557/576997
  return (Math.random().toString(36) + '00000000000000000').slice(2, length + 2)
}

export function getModuleName(filePath) {
  // extract last directory in a file path
  return filePath.match(/([^\/]*)\/[^\/]+$/)[1]
}
