var React =  require('react');
var {Styles, FlatButton, EnhancedButton, IconButton} = require('material-ui');
var Colors = Styles.Colors;
var {Router, Link} = require('react-router');

var InlineUser = React.createClass({
    render: function() {
        var styles = this.getStyles();
        return (
            <Link to="/user-profile">
                <FlatButton label={this.props.id} style={styles.inlineUser}/>
            </Link>
        );
    },
    getStyles: function () {
        var lightBlue = Colors.lightBlue300;
        return {
            inlineUser: {
                color: lightBlue,
                backgroundColor: Colors.transparent,
                border: 0,
                minWidth: 0
            }
    }
});

module.exports = InlineUser;