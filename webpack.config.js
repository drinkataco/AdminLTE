const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Babel = require('babel-loader');
const FileLoader = require('file-loader');
const ImageLoader = require('image-webpack-loader');

const extractLESS = new ExtractTextPlugin('../../dist/css/[name].min.css');


module.exports = {
  context: path.resolve(__dirname, ''),

  entry: {
    // JS
    adminlite: './build/js/main.js',

    // Styles and Skins
    styles: './build/less/AdminLTE.less',
    all_skins: './build/less/skins/_all-skins.less',
    skin_black_light: './build/less/skins/skin-black-light.less',
    skin_black: './build/less/skins/skin-black.less',
    skin_blue_light: './build/less/skins/skin-blue-light.less',
    skin_blue: './build/less/skins/skin-blue.less',
    skin_green_light: './build/less/skins/skin-green-light.less',
    skin_green: './build/less/skins/skin-green.less',
    skin_purple_light: './build/less/skins/skin-purple-light.less',
    skin_purple: './build/less/skins/skin-purple.less',
    skin_red_light: './build/less/skins/skin-red-light.less',
    skin_red: './build/less/skins/skin-red.less',
    skin_yellow_light: './build/less/skins/skin-yellow-light.less',
    skin_yellow: './build/less/skins/skin-yellow.less',
  },

  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].bundle.js',
  },

  module: {
    loaders: [
      // transpile ES6/7 to ES5 via babel
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
         loader: 'babel-loader',
         query: {
             presets: ['es2015']
         }
      },
      // Compile LESS
      {
        test: /\.less$/,
        exclude: /(node_modules)/,
        loader: extractLESS.extract(
          'css-loader?url=false!less-loader',
          'css-loader?url=false!less-loader'
        ),
      },
      // Image Loader
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        loaders: [
          'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
        ]
      }
    ]
  },

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
    ]),
    extractLESS
  ]
};