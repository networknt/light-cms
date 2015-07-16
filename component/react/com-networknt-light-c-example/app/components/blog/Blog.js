var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogData = require('./MockBlogData');
var BlogStore = require('../../stores/BlogStore');
var BlogAPI = require('../../services/BlogAPI');

function getBlogState() {
    return {
        blogs: BlogStore.getBlogs()
    };
}

var Blog = React.createClass({

    componentWillMount: function() {
        BlogData.init();
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this._onChange);
        BlogAPI.getBlogs();
    },

    getInitialState: function() {
        return getBlogState();
    },

    render: function() {
        return (
            <FullWidthSection>
                Blog Data:
                {JSON.stringify(this.state.blogs)}
            </FullWidthSection>
        );
    },

    _onChange: function() {
        this.state = getBlogState();
    },

    componentWillUnmount: function() {
        BlogStore.removeChangeListener(this._onChange);
    }

});

module.exports = Blog;