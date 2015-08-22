var React = require('react');
var {Dialog} = require('material-ui');

var Logout = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            modal: true
        }
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
            modal={this.state.modal}
            openImmediately={true}>
            You are now logged out.
        </Dialog>
        );
    },

    _onDialogAck: function() {
        this.refs.logoutDialog.dismiss();
        this.context.router.transitionTo('/home');
    }
});

module.exports = Logout;
