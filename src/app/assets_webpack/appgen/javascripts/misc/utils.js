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
