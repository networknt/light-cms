var React = require('react');
var Router = require('react-router');
var {Link} = require('react-router');
var {Styles, RaisedButton, AppBar, FlatButton, IconMenu, IconButton, FontIcon} = require('material-ui')
var MenuItem = require ('material-ui/lib/menus/menu-item');
var ThemeManager = new Styles.ThemeManager();
var {Colors, Typography} = Styles;
var RouteHandler = Router.RouteHandler;
var FullWidthSection = require('../common/full-width-section.js');
var AuthStore = require('../../stores/AuthStore.js');

var InlineUser = require('./../user/src/InlineUser.js');

var LeftNavMenu = require('../menu/LeftNavMenu');

var Main = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    getInitialState: function() {
        return {
            isLoggedIn: AuthStore.isLoggedIn()
        };
    },

    componentDidMount: function() {
        AuthStore.addChangeListener(this._userLoginChange);
    },

    _userLoginChange: function() {
        console.log("Main._userLoginChange", AuthStore.isLoggedIn());
        this.setState({
            isLoggedIn: AuthStore.isLoggedIn()
        })
    },

    _userMenuTouched: function(e, value) {
        console.log("Main._rightMenuChange", value);
        this.context.router.transitionTo('/light-cms/' + value._store.props.value);
    },

    render: function() {
        var styles = this.getStyles();

        var userButton = (
            <IconButton iconClassName="material-icons" iconStyle={styles.userIcon}>person</IconButton>
        );
        // TODO: badge display shopping cart content
        var shoppingCartButton = (
            <span>
                <IconButton iconClassName="material-icons" iconStyle={styles.userIcon}>shopping_cart</IconButton>
            </span>
        );

        var loginMenuItems;
        if (this.state.isLoggedIn) {
            loginMenuItems = (
                <MenuItem value={"logout"} primaryText="Sign out" />
            );
        } else {
            loginMenuItems = (
                <div>
                    <MenuItem value={"login"} primaryText="Log in" />
                    <MenuItem value={"signup"} primaryText="Sign up" />
                </div>
            );
        }

        var rightMenu = (
            <div>
                {shoppingCartButton}
                <IconMenu iconButtonElement={userButton}
                          openDirection="bottom-left"
                          onItemTouchTap={this._userMenuTouched}>
                    {loginMenuItems}
                </IconMenu>
            </div>
        );


        return (
            <div style={styles.parent}>
                <AppBar title='NetworkNT' onLeftIconButtonTouchTap={this.showSideBar} iconElementRight={rightMenu} zDepth={0} style={styles.topMenu}/>
                <LeftNavMenu ref="leftNav"/>
                <div className="contentRoot">
                    <RouteHandler />
                </div>

                <FullWidthSection style={styles.footer}>
                    <p style={styles.p}>Copyright NetworkNT - 2015</p>
                </FullWidthSection>
            </div>
        );
    },
    getStyles: function () {
        return {
            parent: {
                position: 'relative',
                margin: '64px 0 120px 0',
                overflow: 'hidden'
            },
            footer: {
                backgroundColor: Colors.grey800,
                textAlign: 'center',
                position: 'fixed',
                left: '0px',
                right: '0px',
                bottom: '0px',
                height: '120px',
                zIndex: '-10'
            },
            userIcon: {
                color: 'rgba(255, 255, 255, 0.90)'
            },
            a: {
                color: Colors.red
            },
            p: {
                margin: '0 auto',
                padding: '0',
                color: Colors.lightWhite
            },
            rightMenuButton: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.transparent,
                color: Typography.textFullWhite,
                margin: 0,
                paddingTop: 6
            },
            topMenu: {
                backgroundColor: Colors.green300,
                position: 'fixed',
                top: '0px',
                left: '0px',
                right: '0px',
                height: '64px'
            },
            subheaderMenuItem: {
                backgroundColor: Colors.green300
            }
        };
    },
    showSideBar: function (e) {
        this.refs.leftNav.toggle()
    },
    componentWillMount: function() {
        ThemeManager.setTheme(ThemeManager.types.LIGHT);
    }
});

Main.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = Main;