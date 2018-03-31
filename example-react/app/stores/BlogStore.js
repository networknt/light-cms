var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events').EventEmitter;
var AppConstants = require('../constants/AppConstants');
var _ = require('underscore');

var _blogs = [];
var _blogPosts = [];
var _post = {};

var BlogStore = _.extend({}, EventEmitter.prototype, {
    getBlogs: function() {
        return _blogs;
    },

    getBlogPosts: function() {
        return _blogPosts;
    },

    getPost: function() {
        return _post;
    },

    emitChange: function() {
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
    console.log("BlogStore payload:", payload);
    var data = payload.action;
    if (data == null) return;
    if (data.type === AppConstants.ActionTypes.BLOGS_RESPONSE) {
        console.log("BlogStore received BLOGS:", data.json);
        _blogs = data.json;
        BlogStore.emitChange();
    } else if (data.type === AppConstants.ActionTypes.BLOG_POSTS_RESPONSE) {
        console.log("BlogStore received BLOG_POSTS:", data.json);
        _blogPosts = data.json;
        BlogStore.emitChange();
    } else if (data.type === AppConstants.ActionTypes.BLOG_POST_RESPONSE) {
        console.log("BlogStore received BLOG_POST:", data.json);
        _post = data.json;
        BlogStore.emitChange();
    }
    return true;
});

module.exports = BlogStore;