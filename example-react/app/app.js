'use strict';

var React = require('react');
var Router = require('react-router');
var injectTapEventPlugin = require('react-tap-event-plugin');
var AppRoutes = require('./routes.js');

window.React = React;

//Needed for onTouchTap
//Can go away with the react 1.0 release.
injectTapEventPlugin();

var router = require('./stores/RouteStore.js').getRouter();
router.run(function (Handler) {
    React.render(<Handler/>, document.getElementById('content'));
});
