var AppDispatcher = require('../dispatcher/AppDispatcher');
var BlogConstants = require('../constants/BlogConstants');

var BlogActions = {

    receiveBlogs: function(data) {
        AppDispatcher.handleBlogAction({
            actionType: BlogConstants.RECEIVE_DATA,
            data: data
        })
    },

    addBlog: function(blogId, update) {
        AppDispatcher.handleBlogAction({
            actionType: BlogConstants.BLOG_ADD,
            blogId: blogId,
            update: update
        })
    },

    removeBlog: function(blogId) {
        AppDispatcher.handleBlogAction({
            actionType: BlogConstants.BLOG_REMOVE,
            blogId: blogId
        })
    },

    updateBlog: function(blogId, updateData) {
        AppDispatcher.handleBlogAction({
            actionType: BlogConstants.BLOG_UPDATE,
            blogId: blogId,
            updateData: updateData
        })
    }

};

module.exports = BlogActions;