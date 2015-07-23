var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');
var path = require('path');

var host = 'localhost';
var port = 3000;
/*
var express = require('express');
var bundle = require('./bundle.js');
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
  changeOrigin: true
});
var app = express();

bundle();

app.all('/api/rs', function (req, res) {
  console.log("Rerouting /api/rs..");
  proxy.web(req, res, {
    target: 'http://example:8080'
  });
});

proxy.on('error', function(e) {
  console.log('Could not connect to proxy, please try again...');
});

app.listen(port, function () {
  console.log('Server running on port ' + port);
});
*/

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(port, host, function (err, result) {
  if (err) {
    console.log("Error:",err);
    console.log("Result:", result);
  }

  console.log('Listening at ',host,':',port);
});
