var React = require('react');
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Styles = mui.Styles;
var Colors = Styles.Colors;

var RaisedButton = mui.RaisedButton;
var AppBar = mui.AppBar;
var LeftNav = mui.LeftNav;
var MenuItem = mui.MenuItem;
var IconButton = mui.IconButton;

var FullWidthSection = require('./layout/full-width-section.js');

var InlineUser = require('./user/components/InlineUser.js');

require('./main.css');

var Main = React.createClass({

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    render: function() {
        var styles = this.getStyles();
        var menuItems = [
            { type: MenuItem.Types.SUBHEADER, text: 'Component Examples' },
            { route: 'inline-user', text: 'Inline User' },
            { route: 'user-profile', text: 'User Profile' },
            { type: MenuItem.Types.SUBHEADER, text: 'NetworkNT' },
            {
                type: MenuItem.Types.LINK,
                payload: 'https://github.com/networknt',
                text: 'GitHub'
            }
        ];

        // TODO: Add github icon.
        var githubButton = (
            <IconButton
                iconStyle={styles.iconButton}
                iconClassName="muidocs-icon-custom-github"
                href="https://github.com/networknt"
                linkButton={true} />
        );
        return (
            <div>
                <AppBar title='NetworkNT' onLeftIconButtonTouchTap={this.showSideBar} iconElementRight={githubButton} zDepth={0}/>
                <FullWidthSection>
                    <h1>NetworkNT - Components Example</h1>

                    <p>Please feel free to select any example page from the menu in the top left corner to view the example.</p>
                    <p>The following is an example rendering of how a user would appear inline to text referencing this user.</p>
                    <p>This is some text where we reference the user with id = testuser.</p>
                </FullWidthSection>
                <FullWidthSection style={styles.footer}>
                    <p style={styles.p}>Copyright Network NT - 2015</p>
                </FullWidthSection>
                <LeftNav ref="leftNav" docked={false} menuItems={menuItems} />
            </div>
        );
    },
    getStyles: function () {
        let darkWhite = Colors.darkWhite;
        return {
            footer: {
                backgroundColor: Colors.grey900,
                textAlign: 'center'
            },
            a: {
                color: darkWhite
            },
            p: {
                margin: '0 auto',
                padding: '0',
                color: Colors.lightWhite
            },
            iconButton: {
                color: darkWhite
            }
        };
    },
    showSideBar: function (e) {
        this.refs.leftNav.toggle()
    },
    componentWillMount: function() {
        ThemeManager.setTheme(ThemeManager.types.LIGHT);
    },
    componentDidMount: function() {
        console.log("Main Mounted");
    }
});

Main.childContextTypes = {
    muiTheme: React.PropTypes.object
};

module.exports = Main;