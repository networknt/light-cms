var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppConstants = require('../constants/AppConstants');
var MockBlogData = require('../components/blog/MockBlogData');
var $ = require('jquery');

var BlogActions = {

    getBlogs: function() {
        $.ajax({
            type: 'POST',
            url: 'http://example:8080/api/rs',
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
                console.log('Using mock data...');
                AppDispatcher.handleAction({
                    type: AppConstants.ActionTypes.BLOGS_RESPONSE,
                    json: MockBlogData.getBlogs(),
                    error: null
                });
            },
            success: function(result, status, xhr) {
                AppDispatcher.handleAction({
                    type: AppConstants.ActionTypes.BLOGS_RESPONSE,
                    json: result,
                    error: null
                });
            }
        });
    },

    getBlogPosts: function() {
        console.log("Sending for blogPosts");
        AppDispatcher.handleAction({
            type: AppConstants.ActionTypes.BLOG_POSTS_RESPONSE,
            json: MockBlogData.getBlogPosts(),
            error: null
        });
    },

};

module.exports = BlogActions;