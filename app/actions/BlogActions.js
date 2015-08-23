var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlogConstants = require('../constants/BlogConstants');
var AppConstants = require('../constants/AppConstants');
var BlogData = require('../components/blog/MockBlogData');
var $ = require('jquery');

var BlogActions = {

    getBlogs: function() {
        $.ajax({
            type: 'POST',
            url: 'http://networknt.com:8080/api/rs',
            data: JSON.stringify({
                category : 'blog',
                name : 'getBlog',
                readOnly: true,
                "data": {
                    host: AppConstants.host
                }
            }),
            contentType: 'application/json',
            dataType: 'json',
            error: function(jqXHR, status, error) {
                console.log('BlogActions.getBlogs error', error);
            },
            success: function(result, status, xhr) {
                console.log("BlogActions.getBlogs success", result);
                AppDispatcher.handleAction({
                    type: AppConstants.ActionTypes.MENU_RESPONSE,
                    json: result,
                    error: null
                });
            }
        });
    },

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
    receiveBlogPosts: function(blogId) {
        var data = JSON.parse(localStorage.getItem('blogPosts'));
        if (data == null) {
            data = this.initBlogs();
        }
        AppDispatcher.handleAction({
            actionType: BlogConstants.RECEIVE_BLOG_POSTS,
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