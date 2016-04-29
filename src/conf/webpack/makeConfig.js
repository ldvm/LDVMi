var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var loadEntries = require('./loadEntries');

var SOURCE_DIR = __dirname + '/../../app/assets_webpack/appgen/javascripts';
var TARGET_DIR = __dirname + '/../../public/javascripts/appgen';

module.exports = function makeConfig(isDevelopment) {
  function makeEntry()  {
    return loadEntries(SOURCE_DIR + '/entries', isDevelopment);
  }

  function makeDevtool() {
    return isDevelopment ? 'cheap-module-eval-source-map' : '';
  }

  function makeOutput() {
    return {
      path: TARGET_DIR,
      filename: '[name].bundle.js',
      // The publicPath configuration is used in production mode when asynchronously loading
      // javascript bundles. We don't use that feature so this directive is useful only in
      // development mode.
      publicPath: isDevelopment ? 'http://localhost:9090/build/' : '/assets/javascripts/appgen'
    }
  }

  function makeLoaders() {
    var babelSettings = {
      cacheDirectory: true,
      plugins: ['transform-runtime'],
      env: {
        production: {
          plugins: [
            'transform-react-constant-elements',
            'transform-react-inline-elements'
          ]
        }
      }
    };

    return [
      {
        test: /\.js$/,
        loaders: ['react-hot', 'babel?' + JSON.stringify(babelSettings)],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style!css?modules',
        include: /flexboxgrid/,
      }
      , {
        test: /(\.scss|\.css)$/,
        loader: 'style!css!sass',
        exclude: /node_modules/
      }
    ]
  }

  function makePlugins() {
    var plugins = [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(isDevelopment ? 'development' : 'production')
        }
      })
    ];


    if (isDevelopment) {
      plugins.push(
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.NoErrorsPlugin()
        // Hot module replacement already enabled with the --hot option.
        // new webpack.HotModuleReplacementPlugin()
      );
    } else {
      plugins.push(
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            screw_ie8: true, // eslint-disable-line camelcase
            warnings: false // Because uglify reports irrelevant warnings.
          }
        })
      );
    }

    return plugins;
  }

  return {
    entry: makeEntry(),
    devtool: makeDevtool(),
    output: makeOutput(),
    resolve: {
      extensions: ['', '.js', '.json', '.scss']
    },
    module: {
      loaders: makeLoaders()
    },
    postcss: [autoprefixer],
    plugins: makePlugins()
  }
};
