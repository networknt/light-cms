var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');
var mainPath = path.resolve(__dirname, 'app', 'app.js');

module.exports = {

  // Makes sure errors in console map to the correct file and line number
  //devtool: 'eval',

  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './app/app'
  ],

  output: {
    path: __dirname,
    filename: 'dist/bundle.js',
    publicPath: 'http://localhost:3000/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
      { test: /\.js$/,
        loaders: ['babel'],
        exclude: [nodeModulesPath]
      },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};