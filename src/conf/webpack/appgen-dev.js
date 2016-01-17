var webpack = require('webpack');

var dir = __dirname + '/../../app/assets_webpack/appgen/javascripts';

module.exports = {
    entry: [
        'webpack-hot-middleware/client',
        dir + '/index.js'
    ],
    devtool: 'cheap-module-eval-source-map',
    output: {
        path: __dirname + "/../../target/web/public/main/javascripts/appgen/index.js",
        filename: "bundle.js",
        publicPath: "http://localhost:9090/build/"
    },
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                exclude: /node_modules/
            },
            {test: /\.less$/, loader: 'style!css!less'}
        ]
    }
};