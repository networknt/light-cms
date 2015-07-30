var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlogConstants = require('../constants/BlogConstants');
var AppConstants = require('../constants/AppConstants');
var BlogData = require('../components/blog/MockBlogData');

var BlogActions = {

    initBlogs: function() {
        return BlogData.init();
    },

    receiveBlogs: function() {
        var data = JSON.parse(localStorage.getItem('blogs'));
        if (data == null) {
            data = this.initBlogs();
        }
        AppDispatcher.handleAction({
            actionType: BlogConstants.RECEIVE_BLOGS,
            data: data
        })
    },

    /*
    TODO: Actually use blogId for starters...
     */
    receiveBlog: function(blogId) {
        var data = JSON.parse(localStorage.getItem('blog'));
        if (data == null) {
            data = this.initBlogs();
        }
        AppDispatcher.handleAction({
            actionType: BlogConstants.RECEIVE_BLOG,
            data: data
        })
    },

    gotoBlog: function(blog) {
        AppDispatcher.handleAction(({
            actionType: AppConstants.ActionTypes.REDIRECT,
            route: 'blogView',
            data: blog
        }));
    },

    addBlog: function(blogId, update) {
        AppDispatcher.handleAction({
            actionType: BlogConstants.BLOG_ADD,
            blogId: blogId,
            update: update
        })
    },

    removeBlog: function(blogId) {
        AppDispatcher.handleAction({
            actionType: BlogConstants.BLOG_REMOVE,
            blogId: blogId
        })
    },

    updateBlog: function(blogId, updateData) {
        AppDispatcher.handleAction({
            actionType: BlogConstants.BLOG_UPDATE,
            blogId: blogId,
            updateData: updateData
        })
    }

};

module.exports = BlogActions;