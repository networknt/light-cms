var React = require('react');
var {Dialog} = require('material-ui');
var AuthActions = require('../../actions/AuthActions');

var Logout = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

    componentDidMount: function() {
        AuthActions.logout();
    },

    getInitialState: function() {
        return {}
    },

    render: function() {
        var standardActions = [
            { text: 'Thank you!', onTouchTap: this._onDialogAck, ref: 'submit' }
        ];
        return (
        <Dialog
            title="Log out successful"
            actions={standardActions}
            actionFocus="submit"
            ref="logoutDialog"
            modal={false}
            openImmediately={true}
            onDismiss={this._onDialogAck}>
            You are now logged out.
        </Dialog>
        );
    },

    _onDialogAck: function() {
        this.context.router.transitionTo('/light-cms/home');
    }
});

module.exports = Logout;
