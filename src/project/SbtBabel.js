var path = require('path');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

console.log('Running SbtBabel.js' + argv.out);
console.log(' --in ' + argv.in);
console.log(' --out ' + argv.out);
console.time('elapsed');

var compiler = webpack({
    entry: argv.in,
    devtool: 'source-map',
    cache: true,
    module: {
        loaders: [
            {test: /\.jsx$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    output: {
        filename: argv.out
    }
});

compiler.run(function (err, stats) {
    if (err) {
        console.log(err);
        throw err;
    }
    var json = stats.toJson();
    if (json.errors.length > 0) {
        console.log(json.errors);
        throw json.errors[0];
    }

    console.timeEnd('elapsed');
});