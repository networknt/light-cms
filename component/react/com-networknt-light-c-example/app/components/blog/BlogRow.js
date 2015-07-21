var React =  require('react');
var {ListItem} = require('material-ui')
var BlogActions = require('../../actions/BlogActions');

var BlogRow = React.createClass({
    componentDidMount: function() {
        console.log("BlogRow props:", this.props);
    },
    render: function() {
        var children;
        if (this.props.blog.out_Own != null && this.props.nestedLevel < 1) {
            // Recursive nesting ListItem seems to be broken in material-ui...
            // will fix eventually...
            /*
            var nestedLevel = this.props.nestedLevel + 1;
            children = this.props.blog.out_Own.map(function (blogChild) {
                return <BlogRow blog={blogChild} nestedLevel={nestedLevel} />;
            });
            */
            /*
             if (!this.props.blog.out_Own) this.props.blog.out_Own = [];
             this.props.blog.out_Own.map(function (child) {
             return <BlogRow blog={child} nestedLevel={nestedLevel} />
             }.bind(this))
             */
        }

        return (
            this._createItems(this.props.blog)
            //<ListItem primaryText={this.props.blog.blogId} secondaryText={this.props.blog.description} onClick={this._onClick}/>
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
            <ListItem primaryText={this.props.blog.blogId} secondaryText={this.props.blog.description}>{children}</ListItem>
        );
    }

});

module.exports = BlogRow;