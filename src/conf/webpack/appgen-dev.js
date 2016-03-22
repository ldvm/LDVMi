var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var autoprefixer = require('autoprefixer');
var loadEntries = require('./loadEntries');

var dir = __dirname + '/../../app/assets_webpack/appgen/javascripts';

module.exports = {
  entry: loadEntries(dir + '/entries'),
  devtool: 'cheap-module-eval-source-map',
  // devtool: 'cheap-module-source-map',
  output: {
    path: __dirname + "/../../target/web/public/main/javascripts/appgen/",
    filename: "[name].bundle.js",
    publicPath: "http://localhost:9090/build/"
  },
  resolve: {
    extensions: ['', '.js', '.json', '.scss']
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loaders: ['react-hot', 'babel'],
        exclude: /node_modules/
      }, {
        test: /(\.scss|\.css)$/,
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss!sass?sourceMap'),
        include: /node_modules/
      }, {
        test: /(\.scss|\.css)$/,
        loader: 'style!css!sass',
        exclude: /node_modules/
      }
    ]
  },
  postcss: [autoprefixer],
  plugins: [
    new ExtractTextPlugin('bundle.css', {allChunks: true}),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
         // NODE_ENV: JSON.stringify("production")
      }
    })
  ]
};