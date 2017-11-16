const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, ''),
  entry: {
    app: './build/js/main.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: 'adminlite.bundle.js',
  },
  // Some of these files we don't want to webpack. but just copy over to local directory
  plugins: [
    new CopyWebpackPlugin([
      // Bootstrap CSS
      {
        from: './node_modules/bootstrap/dist/css/bootstrap.min.css',
        to: '../../assets/bootstrap/css',
        flatten: true
      },
      // Bootstrap Fonts
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