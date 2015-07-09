'use strict';

window.jQuery = require('./node_modules/jquery/dist/jquery.min');
require('./node_modules/semantic-ui/dist/semantic.min.css');
require('./node_modules/semantic-ui/dist/semantic.min');

var React = require('react');
var UserExample = require('./scripts/component/UserExample.js');

React.render(<UserExample></UserExample>, document.getElementById('content'));
