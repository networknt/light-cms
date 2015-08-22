/**
 * Created by steve on 08/07/15.
 */
var React = require('react');
var AuthActions = require('../../actions/AuthActions.js');
var AuthStore = require('../../stores/AuthStore.js');
var ErrorNotice = require('../../components/common/ErrorNotice.js');
var {TextField, RaisedButton, Paper, Styles, Dialog} = require('material-ui');
var FullWidthSection = require('../common/full-width-section.js');
var { Colors, Spacing, Typography } = Styles;

var Signup = React.createClass({
    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState: function() {
        return {
            error: "",
            signupSuccessful: false
        };
    },

    componentDidMount: function() {
        AuthStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        console.log("Signup._onChange");
        this.setState({
            error: AuthStore.getError(),
            signupSuccessful: AuthStore.isLoggedIn()
        });

        if (this.state.error === "") {
            this.refs.signupSuccessful.show();
        } else {
            this.refs.signupFailed.show();
        }
    },

    _onSubmit: function(e) {
        console.log("This.refs:", this.refs);
        e.preventDefault();
        this.setState({ errors: [] });
        var email = this.refs.email.getValue();
        var username = this.refs.username.getValue();
        var password = this.refs.password.getValue();
        var passwordConfirmation = this.refs.passwordConfirmation.getValue();
        if (password !== passwordConfirmation) {
            this.setState({
                error: "Password and password confirmation should match"
            });
        } else {
            AuthActions.signup(email, username, password, passwordConfirmation);
        }
    },

    render: function() {
        var styles = this.getStyles();
        var signupSuccessActions = [
            { text: 'Great!', onTouchTap: this._onDialogAck, ref: 'submit' }
        ];
        var signupFailedActions = [
            { text: 'Try Again' },
            { text: 'Contact Us...'} // Todo....
        ];

        return (
            <FullWidthSection style={styles.root}>
                <Dialog
                    title="Welcome Aboard!"
                    actions={signupSuccessActions}
                    ref="signupSuccessful"
                    modal={false}
                    openImmediately={false}
                    onDismiss={this._dismissSignupSuccess}>
                    An email has been sent to activate the account.
                </Dialog>
                <Dialog
                    title="Error occured during singup"
                    actions={signupFailedActions}
                    ref="signupFailed"
                    modal={false}
                    openImmediately={false}>
                    {this.state.error}
                </Dialog>
                <div style={styles.div}>
                    <form onSubmit={this._onSubmit}>
                        <TextField
                            hintText="Email"
                            floatingLabelText="Email"
                            type="email"
                            ref="email"
                            name="email"
                            onChange={this._handleErrorInputChangeEmail}
                            errorText={this.state.errorTextEmail}/><br />
                        <TextField
                            hintText="Username"
                            floatingLabelText="Username"
                            type="text"
                            ref="username"
                            name="username"
                            onChange={this._handleErrorInputChangeUsername}
                            errorText={this.state.errorTextUsername}/><br />
                        <TextField
                            hintText="Password"
                            floatingLabelText="Password"
                            type="password"
                            ref="password"
                            name="password"
                            onChange={this._handleErrorInputChangePassword}
                            errorText={this.state.errorTextPassword}/><br />
                        <TextField
                            hintText="Password Confirmation"
                            floatingLabelText="Password Confirmation"
                            type="password"
                            ref="passwordConfirmation"
                            name="passwordConfirmation"
                            onChange={this._handleErrorInputChangePasswordConfirmation}
                            errorText={this.state.errorTextPasswordConfirmation}/><br />
                        <RaisedButton label="Signup" primary={true} type="submit" style={styles.submitButton}/>
                    </form>
                </div>
            </FullWidthSection>
        );
    },

    getStyles: function() {
        return {
            root: {
                overflow: 'hidden',
                width: '100%',
                textAlign: 'center',
                display: 'center',
                backgroundColor: Colors.white,
                padding: '0px',
                marginBottom: '0px'
            },
            div: {
                width: '70%',
                margin: 'auto',
                paddingTop: '2%',
                paddingBottom: '2%'
            },
            submitButton: {
                marginTop: '15px'
            }
        };
    },

    _handleErrorInputChangeEmail(e) {
        this.setState({
            emailErrorText: e.target.value ? '' : 'This field is required.'
        });
    },
    _handleErrorInputChangeUsername(e) {
        this.setState({
            emailErrorUsername: e.target.value ? '' : 'This field is required.'
        });
    },
    _handleErrorInputChangePassword(e) {
        this.setState({
            emailErrorPassword: e.target.value ? '' : 'This field is required.'
        });
    },
    _handleErrorInputChangePasswordConfirmation(e) {
        this.setState({
            emailErrorPasswordConfirmation: e.target.value ? '' : 'This field is required.'
        });
    }
});

module.exports = Signup;

