const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, ''),

  entry: {
    adminlite: './build/js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].bundle.js',
  },

  module: {
    rules: [{
      test: /\.less$/,
      use: [{
        loader: "style-loader" // creates style nodes from JS strings
      }, {
        loader: "css-loader" // translates CSS into CommonJS
      }, {
        loader: "less-loader" // compiles Less to CSS
      }]
    }]
  },

  /**
   * Example Plugins to use with Admin Lite
   * @type {Array}
   */
  plugins: [
    new CopyWebpackPlugin([
      // Bootstrap CSS
      // @todo, this is required, so pack?
      {
        from: './node_modules/bootstrap/dist/css/bootstrap.min.css',
        to: '../../assets/bootstrap/css',
        flatten: true
      },
      // Bootstrap Fonts
      // @todo, this is required, so pack?
      {
        from: './node_modules/bootstrap/fonts/*',
        to: '../../assets/bootstrap/fonts',
        flatten: true
      },
      // Font Awsome CSS
      {
        from: './node_modules/font-awesome/css/*',
        to: '../../assets/font-awesome/css',
        flatten: true
      },
      // Font Awsome Fonts
      {
        from: './node_modules/font-awesome/fonts/*',
        to: '../../assets/font-awesome/fonts',
        flatten: true
      },
      // Ion Icons CSS
      {
        from: './node_modules/ionicons/dist/css/*',
        to: '../../assets/ionicons/css',
        flatten: true
      },
      // Ion Icons Fonts
      {
        from: './node_modules/ionicons/dist/fonts/*',
        to: '../../assets/ionicons/fonts',
        flatten: true
      },
      // Velocity JS
      {
        from: './node_modules/velocity-animate/velocity.min.js',
        to: '../../assets/velocity-animate/js',
        flatten: true
      },
      // Bootstrap Native JS
      {
        from: './node_modules/bootstrap.native/dist/bootstrap-native.js',
        to: '../../assets/bootstrap.native/js',
        flatten: true
      },
    ])
  ]
};