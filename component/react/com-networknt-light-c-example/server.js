var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

var host = 'localhost';
var port = 3000;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
  proxy: {
    "*/api/rs": "http://example:8080/api/rs"
  }
}).listen(port, host, function (err, result) {
  if (err) {
    console.log("Error:",err);
    console.log("Result:", result);
  }

  console.log('Listening at ',host,':',port);
});
