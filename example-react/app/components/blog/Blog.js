var React =  require('react');
var {Link} = require('react-router');
var FullWidthSection = require('../common/full-width-section.js');
var BlogStore = require('../../stores/BlogStore');
var BlogActions = require('../../actions/BlogActions');
var {List, ListItem, Paper, RaisedButton} = require('material-ui');
var BlogPosts = require('./BlogPosts');

var Blog = React.createClass({
    componentDidMount: function() {
        BlogStore.addChangeListener(this._receiveBlogPosts);
        BlogActions.getBlogPosts();
    },

    getInitialState: function() {
        return {
            blogPosts: []
        };
    },

    _receiveBlogPosts: function() {
        console.log("Blog._receiveBlogPosts", BlogStore.getBlogPosts());
        this.setState({
            blogPosts: BlogStore.getBlogPosts()
        })
    },

    render: function() {
        return (
            <div>
                <div className="blogHeader">
                    <h2 className="mainBlogHeader">NetworkNt Blogs</h2>
                </div>
                <div className="blogRoot">
                    <BlogPosts blogPosts={this.state.blogPosts} rid={this.props.query.rid}></BlogPosts>
                    <Link to="/light-cms/blogs">
                        <RaisedButton label="Back"/>
                    </Link>
                </div>
            </div>
        );
    }
});

module.exports = Blog;