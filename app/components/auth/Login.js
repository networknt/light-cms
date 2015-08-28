/**
 * Created by steve on 08/07/15.
 */
var React = require('react');
var AuthActions = require('../../actions/AuthActions.js');
var AuthStore = require('../../stores/AuthStore.js');
var ErrorNotice = require('../../components/common/ErrorNotice.js');
var {TextField, RaisedButton, Paper, Styles, Checkbox, Dialog} = require('material-ui');
var FullWidthSection = require('../common/full-width-section.js');
var { Colors, Spacing, Typography } = Styles;

var Login = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            error: "",
            loginSuccessful: false
        };
    },

    componentDidMount: function() {
        AuthStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({
            error: AuthStore.getError(),
            loginSuccessful: AuthStore.isLoggedIn()
        });

        if (this.state.loginSuccessful) {
            this.refs.loginSuccessful.show();
        } else {
            this.refs.loginFailed.show();
        }

        console.log("Login._onChange: error set to:", AuthStore.getError());
        console.log("Login._onChange: ")
    },

    _onSubmit: function(e) {
        e.preventDefault();
        this.setState({ errors: [] });
        var userIdEmail = this.refs.userIdEmail.getValue();
        var password = this.refs.password.getValue();
        var rememberMe = this.refs.rememberMe.isChecked();
        AuthActions.login(userIdEmail, password, rememberMe);
    },

    _dismissLoginSuccess: function () {
        this.context.router.transitionTo('/light-cms/home');
    },

    render: function() {
        var styles = this.getStyles();
        var loginSuccessActions = [
            { text: 'Thank you!', onTouchTap: this._onDialogAck, ref: 'submit' }
        ];
        var loginFailedActions = [
            { text: 'Try Again' },
            { text: 'I forgot it...'} // Todo....
        ];
        return (
            <FullWidthSection style={styles.root}>
                <Dialog
                    title="Log in successful!"
                    actions={loginSuccessActions}
                    ref="loginSuccessful"
                    modal={false}
                    openImmediately={false}
                    onDismiss={this._dismissLoginSuccess}>
                    You are now logged in!
                </Dialog>
                <Dialog
                    title="Error occured during login"
                    actions={loginFailedActions}
                    ref="loginFailed"
                    modal={false}
                    openImmediately={false}>
                    {this.state.error}
                </Dialog>
                <center>
                    <form onSubmit={this._onSubmit}>
                        <TextField
                            hintText="User ID or Email"
                            floatingLabelText="User ID or Email"
                            type="text"
                            ref="userIdEmail"
                            name="userIdEmail" /><br />
                        <TextField
                            hintText="Password"
                            floatingLabelText="Password"
                            type="password"
                            ref="password"
                            name="password" /><br />
                        <Checkbox
                            name="rememberMe"
                            value="rememberMe"
                            ref="rememberMe"
                            label="Remember Me"
                            style={styles.rememberMe}/><br />
                        <RaisedButton label="Login" primary={true} type="submit" style={styles.submitButton}/>
                    </form>
                </center>
            </FullWidthSection>
        );
    },

    getStyles: function() {
        return {
            root: {
                display: 'center',
                backgroundColor: Colors.white,
                padding: '0px',
                marginBottom: '0px'
            },
            div: {
                width: '70%',
                paddingTop: '2%',
                paddingBottom: '2%'
            },
            submitButton: {
                marginTop: '15px'
            },
            rememberMe: {
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '170px',
                paddingTop: '15px'
            }
        };
    }
});

module.exports = Login;
