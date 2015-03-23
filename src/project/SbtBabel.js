var path = require('path');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

var compiler = webpack({
    entry: argv.in,
    devtool: 'source-map',
    cache: true,
    module: {
        loaders: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    output: {
        path: path.dirname(argv.out),
        filename: path.basename(argv.out)
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
});