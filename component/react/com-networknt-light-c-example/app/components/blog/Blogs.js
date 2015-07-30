var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem, Paper} = require('material-ui');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');

var Blogs = React.createClass({

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
            <Paper>
                <h2 style={{'padding-left': "15px", 'padding-top': "20px"}} >Blogs</h2>
                <List>
                    {
                        this.state.blogs.map(function (blog) {
                            return (
                                <BlogRow key={blog.blogId} blog={blog} nestedLevel={0}></BlogRow>
                            );
                        })
                        }
                </List>
            </Paper>
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

module.exports = Blogs;