export function getDistinctCount(getKey, array) {
  var set = new Set();
  for (var element of array) {
    var key = getKey(element);
    if (!set.has(key)) set.add(key);
  }
  return set.size;
}
