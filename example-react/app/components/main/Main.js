var React = require('react');
var Router = require('react-router');
var {Link} = require('react-router');
var {Styles, RaisedButton, AppBar, MenuItem, FlatButton} = require('material-ui')
var ThemeManager = new Styles.ThemeManager();
var {Colors, Typography} = Styles;
var RouteHandler = Router.RouteHandler;
var FullWidthSection = require('../common/full-width-section.js');
var AuthStore = require('../../stores/AuthStore.js');

var InlineUser = require('./../user/src/InlineUser.js');

require('./style/main.css');

var LeftNavMenu = require('../menu/src/LeftNavMenu');

var Main = React.createClass({
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },

    getInitialState: function() {
        return {
            isLoggedIn: AuthStore.isLoggedIn
        };
    },

    componentDidMount: function() {
        AuthStore.addChangeListener(this._userLoginChange);
    },

    _userLoginChange: function() {
        this.setState({
            isLoggedIn: AuthStore.isLoggedIn
        })
    },

    render: function() {
        var styles = this.getStyles();


        // TODO: Add github icon.
        var githubButton = (
            <Link to="/signup">
                <FlatButton label="Signup" style={styles.githubButton}/>
            </Link>
        );
        return (
            <div style={styles.html}>
                <AppBar title='NetworkNT' onLeftIconButtonTouchTap={this.showSideBar} iconElementRight={githubButton} zDepth={0} style={styles.topMenu}/>
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
            githubButton: {
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