var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem} = require('material-ui')

var Blog = React.createClass({

    componentDidMount: function() {
        BlogStore.addChangeListener(this._onChange);
        BlogAction.receiveBlogs();
    },

    getInitialState: function() {
        return BlogStore.getBlogState();
    },

    render: function() {
        return (
            <FullWidthSection>
                <h1>Blogs</h1>
                <List>
                {
                    this.state.blogs.map(function (blog) {
                        return (
                            <BlogRow blog={blog}></BlogRow>
                        );
                    })
                }
                </List>
            </FullWidthSection>
        );
    },

    _onChange: function() {
        this.setState(BlogStore.getBlogState());
    },

    componentWillUnmount: function() {
        BlogStore.removeChangeListener(this._onChange);
    }

});

module.exports = Blog;