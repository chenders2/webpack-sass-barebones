const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const pkg = require('./package.json');
const dirs = pkg['h5bp-configs'].directories;

const isProd = process.env.NODE_ENV === 'production';
const webpackPlugins = [];
if (isProd) {
  webpackPlugins.push(new ExtractTextPlugin({
    filename: "main.css"
  }))
} else {
  webpackPlugins.push(new webpack.HotModuleReplacementPlugin())
}
webpackPlugins.push(new HtmlWebpackPlugin({
  template: path.resolve(__dirname, dirs.src.web, 'index.html'),
  inject: 'body'
}))
module.exports = {
  entry: path.resolve(dirs.src.web, 'index.js'),
  output: {
    path: path.resolve(__dirname, dirs.dist),
    pathinfo: true,
    publicPath: '/',
    filename: 'main.js'
  },
  devServer: {
    hot: true,
    contentBase: path.resolve(__dirname, dirs.dist),
    publicPath: '/'
  },
  module: {
    rules: [{
      test: /\.scss$/,
      enforce: 'pre',
      use: [{
        loader: "sass-loader",
        options: {
          outputStyle: 'expanded'
        }
      }]
    }, {
        test: /\.scss$/,
        use: isProd ? ExtractTextPlugin.extract({
          use: ['css-loader', 'autoprefixer-loader']
        }) : ['style-loader', 'css-loader', 'autoprefixer-loader']
    }]
  },
  plugins: webpackPlugins
}
