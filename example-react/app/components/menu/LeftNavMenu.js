var React = require('react');
var Router = require('react-router');
var { MenuItem, LeftNav, Styles } = require('material-ui');
var ThemeManager = Styles.ThemeManager();
var { Colors, Spacing, Typography } = Styles;

var MenuStore = require('../../stores/MenuStore');
var MenuActions = require('../../actions/MenuActions');

var LeftNavMenu = React.createClass({

    componentWillMount: function() {
        ThemeManager.setComponentThemes({
            menuSubheader: {
                textColor: Colors.green300
            }
        });
    },

    getInitialState: function() {
        return {
            menu: []
        }
    },

    componentDidMount: function() {
        MenuStore.addChangeListener(this._onMenuChange);
        MenuActions.getMenu();
    },

    /**
     * Nested menu's currently broken in material-ui (will redo when fixed)
     * https://github.com/callemall/material-ui/issues/744
     *
     * In the meanwhile, flatten first 2 levels.
     *
     * @private
     */
    _onMenuChange: function() {
        var menuItems = MenuStore.getMenu();
        var newMenu = MenuStore.getDefaultMenu();
        for (var i = 0; i < menuItems.length; i++) {
            if (menuItems[i].out_Own != null && menuItems[i].out_Own.length > 0) {
                for (var j = 0; j < menuItems[i].out_Own.length; j++) {
                    newMenu.push({
                        route: menuItems[i].out_Own[j].path,
                        text: menuItems[i].out_Own[j].label
                    })
                }
            } else {
                newMenu.push({
                    route : menuItems[i].path,
                    text: menuItems[i].label
                })
            }
        }
        this.setState({
            menu: newMenu
        })
    },

    getStyles: function() {
        return {
            root: {
                cursor: 'pointer',
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
                "SubheaderMenuItem backgroundColor": Colors.green400
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
                menuItems={this.state.menu}
                selectedIndex={this.getSelectedIndex()}
                onChange={this.onLeftNavChange} />
        );
    },

    toggle: function() {
        this.refs.leftNav.toggle();
    },

    getSelectedIndex: function() {
        var currentItem;
        for (var i = this.state.menu.length - 1; i >= 0; i--) {
            currentItem = this.state.menu[i];
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