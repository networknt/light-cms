var React =  require('react');
var {ListItem, Styles} = require('material-ui')
var BlogActions = require('../../actions/BlogActions');
var { Colors, Spacing, Typography } = Styles;



var BlogRow = React.createClass({
    componentDidMount: function() {
        console.log("BlogRow props:", this.props);
    },
    render: function() {
        return (
            this._createItems(this.props.blog)
        );
    },

    _onTouchTap: function() {
        console.log("Going to blog", this.props.blog);
        BlogActions.gotoBlog(this.props.blog);
    },

    _createItems: function(blogs) {
        var children;
        var styles = this.getStyles();
        if (blogs.out_Own) {
            children = blogs.out_Own.map(function (child) {
                return this._createItems(child);
            }.bind(this));
        }
        return (
            <ListItem

                primaryText={this.props.blog.blogId} secondaryText={this.props.blog.description} onTouchTap={this._onTouchTap}>{children}</ListItem>
        );
    },

    getStyles: function() {
        return {
            primaryTextStyle: {
                fontSize: '20px',
                lineHeight: '28px',
                paddingTop: '19px',
                marginBottom: '13px',
                letterSpacing: '0',
                color: Colors.darkWhite,
                fontWeight: Typography.fontWeightLight
            },
            secondaryText: {

            }
        };
    }

});

module.exports = BlogRow;