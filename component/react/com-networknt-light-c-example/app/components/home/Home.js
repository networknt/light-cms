var React = require('react');
var Router = require('react-router');
var {RaisedButton, Styles} = require('material-ui');
var FullWidthSection = require('../common/full-width-section.js');
var { Colors, Spacing, Typography } = Styles;

var Home = React.createClass({
    render: function() {
        var style=this.getStyles();
        return (
            <FullWidthSection style={style.root}>
                <div style={style.tagline}>
                    <h1 style={style.h1}>NetworkNT - Components Example</h1>
                    <h2 style={style.h2}>
                        Please select any page from the menu in the top left corner to view the example.
                    </h2>
                    <RaisedButton label="GitHub" linkButton={true} href="https://github.com/networknt"/>
                </div>
            </FullWidthSection>
        );
    },
    getStyles: function () {
        return {
            root: {
                backgroundColor: Colors.green400,
                overflow: 'hidden'
            },
            tagline: {
                margin: '16px auto 0 auto',
                textAlign: 'center',
                maxWidth: '575px'
            },
            h1: {
                color: Colors.darkWhite,
                fontWeight: Typography.fontWeightLight
            },
            h2: {
                //.mui-font-style-title
                fontSize: '20px',
                lineHeight: '28px',
                paddingTop: '19px',
                marginBottom: '13px',
                letterSpacing: '0',
                color: Colors.darkWhite,
                fontWeight: Typography.fontWeightLight
            }
        };
    }
});

module.exports = Home;