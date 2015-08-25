var React = require('react');
var {ListItem, Styles, Avatar} = require('material-ui')
var BlogActions = require('../../actions/BlogActions');
var { Colors, Spacing, Typography} = Styles;


var BlogRow = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    render: function () {
        return (
            this._createItems(this.props.blog)
        );
    },

    _onTouchTap: function () {
        this.context.router.transitionTo("/light-cms/blog");
    },

    _createItems: function (blogs) {
        var children;
        var styles = this.getStyles();
        if (blogs.out_Own) {
            children = blogs.out_Own.map(function (child) {
                return this._createItems(child);
            }.bind(this));
        }
        return (
            <ListItem
                leftAvatar={this._getLeftAvatar(blogs)}
                primaryText={this._getPrimaryText(blogs)}
                secondaryText={blogs.description}
                onTouchTap={this._onTouchTap}>{children}</ListItem>
        );
    },

    _getLeftAvatar: function(blogs) {
        var count = "0";
        if (blogs.out_HasPost != null && blogs.out_HasPost.length > 0) {
            count = blogs.out_HasPost.length.toString();
        }
        return (
            <Avatar color={Colors.pinkA200}
                    backgroundColor={Colors.green300}
                    style={{borderRadius: '25%', left:8, fontWeight: Typography.fontWeightLight, fontSize: '20px'}}>{count}</Avatar>
        );
    },

    _getPrimaryText: function(blogs) {
        return (
            <p>
                {blogs.blogId}
            </p>
        );
    },

    getStyles: function () {
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
            secondaryText: {}
        };
    }

});

module.exports = BlogRow;