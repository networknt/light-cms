var React = require('react');
var Router = require('react-router');
var { MenuItem, LeftNav, Styles } = require('material-ui');
var { Colors, Spacing, Typography } = Styles;

var menuItems = [
    { type: MenuItem.Types.SUBHEADER, text: 'Component Examples' },
    { route: 'blogs', text: 'Blog'},
    { route: 'forum', text: 'Forum'},
    { route: 'news', text: 'News'},
    { route: 'user-example', text: 'User Example' },
    { type: MenuItem.Types.SUBHEADER, text: 'NetworkNT' },
    {
        type: MenuItem.Types.LINK,
        payload: 'https://github.com/networknt',
        text: 'GitHub'
    }
];


var LeftNavMenu = React.createClass({

    getStyles: function() {
        return {
            cursor: 'pointer',
            //.mui-font-style-headline
            fontSize: '24px',
            color: Typography.textFullWhite,
            lineHeight: Spacing.desktopKeylineIncrement + 'px',
            fontWeight: Typography.fontWeightLight,
            backgroundColor: Colors.cyan500,
            paddingLeft: Spacing.desktopGutter,
            paddingTop: '0px',
            marginBottom: '8px'
        };
    },

    render: function() {
        var header = (
            <div style={this.getStyles()} onTouchTap={this.onHeaderClick}>NetworkNT</div>
        );

        return (
            <LeftNav
                ref="leftNav"
                docked={false}
                isInitiallyOpen={false}
                header={header}
                menuItems={menuItems}
                selectedIndex={this.getSelectedIndex()}
                onChange={this.onLeftNavChange} />
        );
    },

    toggle: function() {
        this.refs.leftNav.toggle();
    },

    getSelectedIndex: function() {
        var currentItem;
        for (var i = menuItems.length - 1; i >= 0; i--) {
            currentItem = menuItems[i];
            if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
        }
    },

    onLeftNavChange: function(e, key, payload) {
        this.context.router.transitionTo(payload.route);
    },

    onHeaderClick: function () {
        this.context.router.transitionTo('root');
        this.refs.leftNav.close();
    }

});

LeftNavMenu.contextTypes = {
    router: React.PropTypes.func
};

module.exports = LeftNavMenu;