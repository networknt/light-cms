var React = require('react');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;

var RaisedButton = mui.RaisedButton;
var AppBar = mui.AppBar;
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;
var Paper = mui.Paper;

var InlineUser = require('./InlineUser.js');

var UserExample = React.createClass({

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    render: function() {
        var menuItems = [
            { route: 'inline-user', text: 'Inline User' },
            { route: 'user-profile', text: 'User Profile' },
            { type: MenuItem.Types.SUBHEADER, text: 'NetworkNT' },
            {
                type: MenuItem.Types.LINK,
                payload: 'https://github.com/networknt',
                text: 'GitHub'
            }
        ];
        return (
            <div>
                <AppBar title='User Example' onLeftIconButtonTouchTap={this.showSideBar}/>
                <Paper zDepth={2}>
                    <p>The following is an example rendering of how a user would appear inline to text referencing this user.</p>
                    <p>This is some text where we reference the user with id = testuser.</p>
                </Paper>
                <LeftNav ref="leftNav" docked={false} menuItems={menuItems} />
            </div>
        );
    },
    showSideBar: function (e) {
        this.refs.leftNav.toggle()
    },
    componentWillMount: function() {
        ThemeManager.setTheme(ThemeManager.types.LIGHT);
    },
    componentDidMount: function() {
        console.log("UserExample Mounted");
    }
});

UserExample.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = UserExample;