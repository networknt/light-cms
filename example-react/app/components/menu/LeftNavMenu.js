var React = require('react');
var Router = require('react-router');
var { MenuItem, LeftNav, Styles } = require('material-ui');
var ThemeManager = Styles.ThemeManager();
var { Colors, Spacing, Typography } = Styles;

var MenuStore = require('../../stores/MenuStore');
var MenuActions = require('../../actions/MenuActions');

var menu = [
    { type: MenuItem.Types.SUBHEADER, text: 'Component Examples' },
    { route: 'blogs', text: 'Blogs'},
    { route: 'forum', text: 'Forum'},
    { route: 'news', text: 'News'},
    { route: 'user-example', text: 'User Example' },
    /*
    { type: MenuItem.Types.SUBHEADER, text: 'User'},
    { route: 'login', text: 'Login'},
    { route: 'logout', text: 'Logout'},
    { route: 'signup', text: 'Sign up'},
    */
    { type: MenuItem.Types.SUBHEADER, text: 'NetworkNT'},
    {
        type: MenuItem.Types.LINK,
        payload: 'https://github.com/networknt',
        text: 'GitHub'
    }
];


var LeftNavMenu = React.createClass({

    componentWillMount: function() {
        ThemeManager.setComponentThemes({
            menuSubheader: {
                textColor: Colors.green300
            }
        });
    },

    componentDidMount: function() {
        MenuStore.addChangeListener(this._onMenuChange);
        MenuActions.getMenu();
    },

    _onMenuChange: function() {
        console.log('LeftNavMenu._onMenuChange');
        // TODO. Menu items would now be set to MenuStore.getMenu(); however format is not currently conducive to this.
    },

    getStyles: function() {
        return {
            root: {
                cursor: 'pointer',
                //.mui-font-style-headline
                fontSize: '24px',
                color: Typography.textFullWhite,
                lineHeight: Spacing.desktopKeylineIncrement + 'px',
                fontWeight: Typography.fontWeightLight,
                backgroundColor: Colors.green300,
                paddingLeft: Spacing.desktopGutter,
                paddingTop: '0px',
                marginBottom: '0px'
            },
            leftNav: {
                ".SubheaderMenuItem backgroundColor": Colors.green300
            }

        };
    },

    render: function() {
        var style = this.getStyles();
        var header = (
            <div style={style.root} onTouchTap={this.onHeaderClick}>NetworkNT</div>
        );

        return (
            <LeftNav
                ref="leftNav"
                style={style.leftNav}
                docked={false}
                isInitiallyOpen={false}
                header={header}
                menuItems={menu}
                selectedIndex={this.getSelectedIndex()}
                onChange={this.onLeftNavChange} />
        );
    },

    toggle: function() {
        this.refs.leftNav.toggle();
    },

    getSelectedIndex: function() {
        var currentItem;
        for (var i = menu.length - 1; i >= 0; i--) {
            currentItem = menu[i];
            if (currentItem.route && this.context.router.isActive(currentItem.route)) return i;
        }
    },

    onLeftNavChange: function(e, key, payload) {
        this.context.router.transitionTo(payload.route);
    },

    onHeaderClick: function () {
        this.context.router.transitionTo('root');
        this.refs.leftNav.close();
    },

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };

    }

});

LeftNavMenu.contextTypes = {
    router: React.PropTypes.func
};

LeftNavMenu.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = LeftNavMenu;