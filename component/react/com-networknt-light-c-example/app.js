'use strict';

var React = require('react');
var Router = require('react-router');
var injectTapEventPlugin = require('react-tap-event-plugin');
var AppRoutes = require('./components/main/src/main-routes.js');

window.React = React;

//Needed for onTouchTap
//Can go away when react 1.0 release
//Check this repo:
//https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

Router.create({
        routes: AppRoutes,
        scrollBehavior: Router.ScrollToTopBehavior
    })
    .run(function (Handler) {
        React.render(<Handler/>, document.getElementById('content'));
    });
