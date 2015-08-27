var React =  require('react');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem, Paper, Styles} = require('material-ui');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var { Colors, Spacing, Typography } = Styles;

var Blogs = React.createClass({

    getInitialState: function() {
        return {
            blogs: []
        }
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this._onChange);
        BlogAction.getBlogs();
    },

    _onChange: function() {
        this.setState({
            blogs: BlogStore.getBlogs()
        });
    },

    render: function() {
        return (
            <div>
                <div className="blogHeader">
                        <h2 className="mainBlogHeader">Blog Component</h2>
                </div>

                <div className="blogsSection">
                    <List className="blogsList" >
                        {
                            this.state.blogs.map(function (blog) {
                                return (
                                    <BlogRow blog={blog}></BlogRow>
                                );
                            })
                        }
                    </List>
                </div>
            </div>
        );
    },

    componentWillUnmount: function() {
        BlogStore.removeChangeListener(this._onChange);
    }

});

module.exports = Blogs;