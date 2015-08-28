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

var RouteStore = assign({}, EventEmitter.prototype, {

    emitChange: function() {
        this.emit(AppConstants.ChangeEvents.ROUTE_CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(AppConstants.ChangeEvents.ROUTE_CHANGE_EVENT, callback);
    },

    removeChangeListener: function() {
        this.removeListener(AppConstants.ChangeEvents.ROUTE_CHANGE_EVENT, callback);
    },

    getRouter: function() {
        return router;
    },

    redirectHome: function() {
        router.transitionTo('root');
    }
});

RouteStore.dispatchToken = AppDispatcher.register(function(payload) {
    var action = payload.action;
    if (action == null) return;
    var type = action.actionType;
    var data = action.data;
    switch(type) {
        case ActionTypes.REDIRECT:
            router.transitionTo(action.route, {data: data});
            break;
        default:
            return true;
    }

    return true;
});

module.exports = RouteStore;