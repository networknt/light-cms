var React = require('react');
var Router = require('react-router');
var {Styles, RaisedButton, AppBar, MenuItem, IconButton} = require('material-ui')
var ThemeManager = new Styles.ThemeManager();
var Colors = Styles.Colors;
var RouteHandler = Router.RouteHandler;
var FullWidthSection = require('./../../layout/src/full-width-section.js');

var InlineUser = require('./../../user/src/InlineUser.js');

require('./../style/main.css');

var LeftNavMenu = require('../../menu/src/LeftNavMenu');

var Main = React.createClass({

    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    render: function() {
        var styles = this.getStyles();


        // TODO: Add github icon.
        var githubButton = (
            <IconButton
                iconStyle={styles.iconButton}
                iconClassName="muidocs-icon-github"
                href="https://github.com/networknt"
                linkButton={true} />
        );
        return (
            <div>
                <AppBar title='NetworkNT' onLeftIconButtonTouchTap={this.showSideBar} iconElementRight={githubButton} zDepth={0}/>
                <LeftNavMenu ref="leftNav"/>

                <RouteHandler />

                <FullWidthSection style={styles.footer}>
                    <p style={styles.p}>Copyright NetworkNT - 2015</p>
                </FullWidthSection>

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