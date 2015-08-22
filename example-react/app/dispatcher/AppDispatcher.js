var Dispatcher = require('flux').Dispatcher;
var assign = require('react/lib/Object.assign');

var AppDispatcher = assign(new Dispatcher(), {
    handleAction: function(action) {
        this.dispatch({
            source: 'APP_ACTION', // not sure why this exists... flux documentation suggests a single dispatcher per application.
            action: action
        });
    }
});

module.exports = AppDispatcher;