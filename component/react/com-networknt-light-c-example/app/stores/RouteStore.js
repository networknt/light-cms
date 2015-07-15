var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');
var EventEmitter = require('events').EventEmitter;
var assign = require('react/lib/Object.assign');

var Router = require('react-router');
var routes = require('../routes.js');

var router = Router.create({
    routes: routes,
    location: Router.HistoryLocation,
    scrollBehavior: Router.ScrollToTopBehavior
});

var ActionTypes = AppConstants.ActionTypes;
var CHANGE_EVENT = AppConstants.CHANGE_EVENT;

var RouteStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function() {
        this.removeListener(CHANGE_EVENT, callback);
    },

    getRouter: function() {
        return router;
    },

    redirectHome: function() {
        router.transitionTo('root');
    }
});

RouteStore.dispatchToken = AppDispatcher.register(function(payload) {
    console.log('payload', payload);
    var type = payload.type;

    switch(type) {
        case ActionTypes.REDIRECT:
            router.transitionTo(action.route);
            break;
        default:
    }

    return true;
});

module.exports = RouteStore;