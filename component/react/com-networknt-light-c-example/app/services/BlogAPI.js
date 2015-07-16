var BlogActions = require('../actions/BlogActions');

module.exports = {
    getBlogs: function() {
        var data = JSON.parse(localStorage.getItem('blogs'));
        BlogActions.receiveBlogs(data);
    }
};