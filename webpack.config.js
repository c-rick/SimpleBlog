// webpack.config.js
// var webpack = require('webpack');

var path = require('path');
var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname, './client/');
console.log(APP_DIR)
var ExtractTextPlugin = require('extract-text-webpack-plugin');  // css单独打包
module.exports = {
  entry: APP_DIR + '/App.js', // 入口文件
  devtool: 'source-map',
  output: {
    path: BUILD_DIR,
    publicPath: '/build/',
    filename: 'bundle.js' // 打包输出的文件
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }, {
      test: /\.(js|jsx)?$/, // test 去判断是否为.js或.jsx,是的话就是进行es6和jsx的编译
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
      query: {
        presets: ['es2015', 'react'],
        plugins: [['antd', {style: 'css'}]]
      }
    }, { test: /\.css$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader'})},
            { test: /\.scss$/, loader: ExtractTextPlugin.extract({fallback: 'style-loader', use: 'css-loader!postcss-loader!sass-loader'})},
            { test: /\.(png|jpg)$/, loader: 'url?limit=8192'}]
  },
  resolve: {
    // 现在你import文件的时候可以直接使用import Func from './file'，不用再使用import Func from './file.js'
    extensions: ['.js', '.jsx', '.json', '.coffee']
  },
  plugins: [
    new ExtractTextPlugin('main.css')
  ]
};



