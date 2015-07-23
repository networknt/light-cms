var React =  require('react');
var {ListItem} = require('material-ui')
var BlogActions = require('../../actions/BlogActions');

var BlogRow = React.createClass({
    componentDidMount: function() {
        console.log("BlogRow props:", this.props);
    },
    render: function() {
        return (
            this._createItems(this.props.blog)
        );
    },

    _onClick: function() {
        console.log("Going to blog", this.props.blog);
        BlogActions.gotoBlog(this.props.blog);
    },

    _createItems: function(blogs) {
        var children;
        if (blogs.out_Own) {
            children = blogs.out_Own.map(function (child) {
                return this._createItems(child);
            }.bind(this));
        }
        return (
            <ListItem primaryText={this.props.blog.blogId} secondaryText={this.props.blog.description} onClick={this._onClick}>{children}</ListItem>
        );
    }

});

module.exports = BlogRow;