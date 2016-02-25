export default function createAction(type, payload, meta) {
  if (meta) {
    return {type, payload, meta};
  } else {
    return {type, payload};
  }
}