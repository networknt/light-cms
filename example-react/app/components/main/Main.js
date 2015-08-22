var React = require('react');
var Router = require('react-router');
var {Link} = require('react-router');
var {Styles, RaisedButton, AppBar, FlatButton, IconMenu, IconButton} = require('material-ui')
var MenuItem = require ('material-ui/lib/menus/menu-item');
var ThemeManager = new Styles.ThemeManager();
var {Colors, Typography} = Styles;
var RouteHandler = Router.RouteHandler;
var FullWidthSection = require('../common/full-width-section.js');
var AuthStore = require('../../stores/AuthStore.js');

var InlineUser = require('./../user/src/InlineUser.js');

require('./main.css');

var LeftNavMenu = require('../menu/src/LeftNavMenu');

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

    _rightMenuChange: function(e, value) {
        console.log("Main._rightMenuChange", value);
        this.context.router.transitionTo('/' + value._store.props.value);
    },

    render: function() {
        var styles = this.getStyles();
        var rightButton = (
            <FlatButton style={styles.rightMenuButton}>
                User
            </FlatButton>
        );

        var rightMenu;
        if (this.state.isLoggedIn) {
            rightMenu = (
            <IconMenu iconButtonElement={rightButton}
                      openDirection="bottom-left"
                      onItemTouchTap={this._rightMenuChange}>
                <MenuItem value={"logout"} primaryText="Sign out" />
            </IconMenu>

            );
        } else {
            rightMenu = (
                <IconMenu iconButtonElement={rightButton}
                          openDirection="bottom-left"
                          onItemTouchTap={this._rightMenuChange}>
                    <MenuItem value={"login"} primaryText="Log in" />
                    <MenuItem value={"signup"} primaryText="Sign up" />
                </IconMenu>
            );
        }

        return (
            <div style={styles.html}>
                <AppBar title='NetworkNT' onLeftIconButtonTouchTap={this.showSideBar} iconElementRight={rightMenu} zDepth={0} style={styles.topMenu}/>
                <LeftNavMenu ref="leftNav"/>
                <RouteHandler />

                <FullWidthSection style={styles.footer}>
                    <p style={styles.p}>Copyright NetworkNT - 2015</p>
                </FullWidthSection>
            </div>
        );
    },
    getStyles: function () {
        return {
            html: {
                position: 'relative',
                margin: '0 0 200px'
            },
            footer: {
                backgroundColor: Colors.grey800,
                textAlign: 'center',
                position: 'fixed',
                left: '0px',
                bottom: '0px',
                height: '100px',
                width: '100%',
                zIndex: '-10'
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
                backgroundColor: Colors.transparent,
                color: Typography.textFullWhite,
                margin: 0,
                paddingTop: 6
            },
            topMenu: {
                backgroundColor: Colors.green300
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