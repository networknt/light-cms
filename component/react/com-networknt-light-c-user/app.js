'use strict';

var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
var UserExample = require('./scripts/component/user/UserExample');

window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();


React.render(<UserExample/>, document.getElementById('content'));
