var Dispatcher = require('flux').Dispatcher;
var assign = require('react/lib/Object.assign');

var AppDispatcher = assign(new Dispatcher(), {
    handleBlogAction: function(action) {
        this.dispatch({
            source: 'BLOG_ACTION',
            action: action
        });
    }
});

module.exports = AppDispatcher;