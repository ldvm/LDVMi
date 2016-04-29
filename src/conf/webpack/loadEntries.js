var fs = require('fs');

module.exports = function loadEntries(dir, isDevelopment) {
  var entries = fs.readdirSync(dir);
  var entryMap = {};

  entries.forEach(function (entry) {
    var name = entry.substr(0, entry.length - 3);
    entryMap[name] = isDevelopment ? [
      'babel-polyfill',
      'webpack-hot-middleware/client',
      dir + '/' + entry ] : [ dir + '/' + entry ];
  });

  return entryMap;
};
