// Functions for parsing large API calls into more batch-sized calls.

// Apply callbacks until limit reaches out.
export async function applyByBatchesWithLimit(arr, batchSize, limit, callback) {
  var retArr = [];
  var remaining = limit;

  // For calls with empty array
  if (arr.length == 0) {
    return await callback(arr, limit);
  }

  for (var i = 0; i < arr.length / batchSize && remaining > 0; ++i) {

    // Boundaries
    const maybeEnd = (i + 1) * batchSize;
    const end = maybeEnd < arr.length ? maybeEnd : arr.length;
    const begin = i * batchSize;

    // Call function with array slice
    var slice = arr.slice(begin, end);
    var result = await callback(slice, remaining);

    // Incorrect result => return only last result ( error state )
    if (!Array.isArray(result)) {
      return result;
    }

    // Correct result => append to retArr
    retArr = retArr.concat(result);

    // Reevaluate limit
    remaining -= result.length;
  }
  return retArr;
}

// Apply callbacks & count total of values returned
export async function applyByBatchesCount(arr, batchSize, callback) {
  var retCount = {value: 0};

  // For calls with empty array
  if (arr.length == 0) {
    return await callback(arr);
  }

  for (var i = 0; i < arr.length / batchSize; ++i) {

    // Boundaries
    const maybeEnd = (i + 1) * batchSize;
    const end = maybeEnd < arr.length ? maybeEnd : arr.length;
    const begin = i * batchSize;

    // Call function with array slice
    var slice = arr.slice(begin, end);
    var result = await callback(slice);

    // Incorrect result => return only last result ( error state )
    if (!Number.isInteger(result.value)) {
      return result;
    }

    // Correct result => append to retArr
    retCount.value += result.value;
  }
  return retCount;
}
