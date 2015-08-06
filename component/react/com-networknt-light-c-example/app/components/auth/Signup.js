/**
 * Created by steve on 08/07/15.
 */
var React = require('react');
var AuthActionCreators = require('../../actions/AuthActionCreators.js');
var AuthStore = require('../../stores/AuthStore.js');
var ErrorNotice = require('../../components/common/ErrorNotice.js');
var {TextField, RaisedButton, Paper, Styles} = require('material-ui');
var FullWidthSection = require('../common/full-width-section.js');
var { Colors, Spacing, Typography } = Styles;

var Signup = React.createClass({

    getInitialState: function() {
        return { errors: [] };
    },

    componentDidMount: function() {
        AuthStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.setState({ errors: AuthStore.getErrors() });
    },

    _onSubmit: function(e) {
        console.log("This.refs:", this.refs);
        e.preventDefault();
        this.setState({ errors: [] });
        var email = this.refs.email.getDOMNode().value;
        var username = this.refs.username.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;
        var passwordConfirmation = this.refs.passwordConfirmation.getDOMNode().value;
        if (password !== passwordConfirmation) {
            this.setState({ errors: ['Password and password confirmation should match']});
        } else {
            AuthActionCreators.signup(email, username, password, passwordConfirmation);
        }
    },

    render: function() {
        var errors = (this.state.errors.length > 0) ? <ErrorNotice errors={this.state.errors}/> : <div></div>;
        var styles = this.getStyles();
        return (
            <FullWidthSection style={styles.root}>
                {errors}
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

