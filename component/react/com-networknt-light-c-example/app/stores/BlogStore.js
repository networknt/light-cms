var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var BlogConstants = require('../constants/BlogConstants');
var AppConstants = require('../constants/AppConstants');
var _ = require('underscore');

var _blogs = [];

var _blogPosts = [];

function loadBlogs(data) {
    _blogs = data;
}
function loadBlogPosts(data) {
    _blogPosts = data;
}

var BlogStore = _.extend({}, EventEmitter.prototype, {
    getBlogState: function() {
        return {
            "blogs": _blogs
        };
    },
    getBlogPostsState: function() {
        return {
            "blogPosts": _blogPosts
        }
    },

    emitChange: function() {
        console.log("Emiting change event...");
        this.emit(AppConstants.ChangeEvents.BLOG_CHANGE_EVENT);
    },

    addChangeListener: function(callback) {
        this.on(AppConstants.ChangeEvents.BLOG_CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener(AppConstants.ChangeEvents.BLOG_CHANGE_EVENT, callback);
    }

});

AppDispatcher.register(function(payload) {
    var action = payload.action;
    var text;
    console.log("BlogStore received payload: ", payload);
    switch(action.actionType) {
        case BlogConstants.RECEIVE_BLOGS:
            console.log("BlogStore received BLOGS:", action.data);
            loadBlogs(action.data);
            break;
        case BlogConstants.RECEIVE_BLOG_POSTS:
            console.log("BlogStore received BLOG_POSTS:", action.data);
            loadBlogPosts(action.data);
            break;
        default:
            return true;
    }
    BlogStore.emitChange();
    return true;
});

module.exports = BlogStore;