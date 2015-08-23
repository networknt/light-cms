var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var BlogConstants = require('../constants/BlogConstants');
var AppConstants = require('../constants/AppConstants');
var _ = require('underscore');

var _blogs = [];
var _blogPosts = [];

var BlogStore = _.extend({}, EventEmitter.prototype, {
    getBlogs: function() {
        return _blogs;
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
    console.log("BlogStore received payload: ", payload);
    if (action == null) return;
    switch(action.actionType) {
        case AppConstants.ActionTypes.RECEIVE_BLOGS:
            console.log("BlogStore received BLOGS:", action.json);
            _blogs = action.json;
            BlogStore.emitChange();
            break;
        case BlogConstants.RECEIVE_BLOG_POSTS:
            console.log("BlogStore received BLOG_POSTS:", action.json);
            _blogPosts = action.json;
            BlogStore.emitChange();
            break;
        default:
            return true;
    }
    return true;
});

module.exports = BlogStore;