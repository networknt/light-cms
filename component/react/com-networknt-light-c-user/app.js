'use strict';

var React = require('react');
var InlineUser = require('./scripts/component/InlineUser');
//var UserProfile = require('./scripts/component/UserProfile');
require('./assets/css/user.css');

React.render(<InlineUser />, document.getElementById('content'));
