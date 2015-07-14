var React =  require('react');
var {Styles, FlatButton, EnhancedButton, IconButton} = require('material-ui');
var Colors = Styles.Colors;
var {Router, Link} = require('react-router');

var InlineUser = React.createClass({
    render: function() {
        var styles = this.getStyles();
        return (
            <Link to={"/u/" + this.props.id}>
                <FlatButton label={this.props.id} style={styles.inlineUser} labelStyle={styles.inlineUserLabel}/>
            </Link>
        );
    },
    getStyles: function () {
        var lightBlue = Colors.lightBlue300;
        return {
            inlineUser: {
                color: lightBlue,
                backgroundColor: Colors.transparent,
                padding: 0,
                margin: 0,
                border: 0,
                minWidth: 0
            },
            inlineUserLabel: {
                padding: 0,
                margin: 0,
                border: 0,
                minWidth: 0
            }
        }
    }
});

module.exports = InlineUser;