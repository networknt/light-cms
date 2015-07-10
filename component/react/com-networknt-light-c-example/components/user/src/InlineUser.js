var React =  require('react');
var {Styles} = require('material-ui');
var Colors = Styles.Colors;

var InlineUser = React.createClass({
    render: function() {
        var style = this.getStyles();
        return (
            <span style={style.inlineUser} onClick={this.gotoUserProfile(this.props.id)}>@{this.props.id}</span>
        );
    },
    getStyles: function () {
        var lightBlue = Colors.red500;
        return {
            inlineUser: {
                color: lightBlue
            }
        };
    },
    gotoUserProfile: function (userId) {
        //Todo
        console.log("Pretend we went to the user profile...");
    }
});

module.exports = InlineUser;