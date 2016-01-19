var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

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
        // new ExtractTextPlugin('bundle.css', {allChunks: true}),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
    ],
    resolve: {
        extensions: ['', '.js', '.json', '.scss']
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['react-hot', 'babel'],
                exclude: /node_modules/
            },
            {
                test: /(\.scss|\.css)$/,
                // loader: ExtractTextPlugin.extract('style-loader', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap'),
                loader: 'style!css!sass'
            }
        ]
    }
};