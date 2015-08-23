var React =  require('react');
var {Link} = require('react-router');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogAction = require('../../actions/BlogActions');
var BlogRow = require('./BlogRow');
var {List, ListItem, Paper, RaisedButton} = require('material-ui');
var BlogPostsView = require('./BlogPostsView');

var BlogView = React.createClass({
    getInitialState: function() {
        return {
            blogPosts: []
        };
    },
    getDefaultProps: function() {
        blogId: ''
    },

    componentDidMount: function() {
        BlogStore.addChangeListener(this._receivedBlog);
        BlogAction.receiveBlogPosts(this.props.blogId);
    },

    render: function() {
        return (
            <FullWidthSection>
                <Link to="/blogs">
                    <RaisedButton label="Back"/>
                </Link>
                <BlogPostsView blogPosts={this.state.blogPosts}></BlogPostsView>
            </FullWidthSection>
        );
    },
    _receivedBlog: function(data) {
        this.setState(BlogStore.getBlogPostsState());
    }
});

module.exports = BlogView;