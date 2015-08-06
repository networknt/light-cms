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
                <Paper style={styles.paper}>
                <form onSubmit={this._onSubmit}>
                    <TextField hintText="Email" floatingLabelText="Email" type="email" /><br />
                    <TextField hintText="Username" floatingLabelText="Username" type="text" /><br />
                    <TextField hintText="Password" floatingLabelText="Password" type="password" /><br />
                    <TextField hintText="Password Confirmation" floatingLabelText="Password Confirmation" type="password" /><br />
                    <RaisedButton label="Submit" primary={true} type="submit"/>
                </form>
                </Paper>
            </FullWidthSection>
        );
    },

    getStyles: function() {
        return {
            root: {
                overflow: 'hidden',
                width: '100%',
                textAlign: 'center',
                display: 'center'
            },
            paper: {
                width: '70%',
                margin: 'auto',
                paddingTop: '2%',
                paddingBottom: '2%'
            }
        };
    }
});

module.exports = Signup;

