"use strict";
/*jslint node: true */

var React = require('react');
var Router = require('react-router');
var injectTapEventPlugin = require('react-tap-event-plugin');
var AppRoutes = require('./routes.js');

require('./assets/stylesheets/main.scss');

window.React = React;

//Needed for onTouchTap
//Can go away with the react 1.0 release.
injectTapEventPlugin();

var router = require('./stores/RouteStore.js').getRouter();
var rootComponentInstance;
router.run(function (Handler) {
    rootComponentInstance = React.render(<Handler/>, document.getElementById('content'));
});

if (module.hot) {
    require('react-hot-loader/Injection').RootInstanceProvider.injectProvider({
        getRootInstances: function () {
            // Help React Hot Loader figure out the root component instances on the page:
            return [rootComponentInstance];
        }
    });
}