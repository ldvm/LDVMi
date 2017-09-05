function getLeveledData(data, levelCheckerFunc, maxLevel) {
  var leveledData = [];
  for (var d of data) {
    var level = 0;
    while (!levelCheckerFunc(level, leveledData, d)) {
      if (level >= maxLevel) {
        level = parseInt(Math.random() * maxLevel);
        break;
      }
      ++level;
    }
    d.level = level;
    leveledData.push(d);
  }
  return leveledData;
}

function isLevelFreeIntervals(level, leveledData, record) {
  for (const d of leveledData) {
    // Level check
    if (level == d.level) {

      // Intersect at the beginning of record interval
      if (record.begin <= d.begin && record.end >= d.begin) return false;

      // Intersect at the end of record interval
      if (record.begin <= d.end && record.end >= d.end) return false;

      // Value inside the record
      if (record.begin <= d.begin && record.end >= d.end) return false;

      // Record inside the value
      if (record.begin >= d.begin && record.end <= d.end) return false;
    }
  }
  return true;
}

// In Instants
function isLevelFreeInstants(level, leveledData, record) {
  for (const d of leveledData) {
    // Level check
    if (level == d.level) {
      if (Math.abs(record.date - d.date) < 10 * 1000) return false;
    }
  }
  return true;
}

export function getLeveledIntervals(data, maxLevel) {
  return getLeveledData(data, isLevelFreeIntervals, maxLevel);
}

export function getLeveledInstants(data, maxLevel) {
  return getLeveledData(data, isLevelFreeInstants, maxLevel);
}
