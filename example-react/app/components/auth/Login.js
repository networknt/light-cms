/**
 * Created by steve on 08/07/15.
 */
var React = require('react');
var AuthActionCreators = require('../../actions/AuthActionCreators.js');
var AuthStore = require('../../stores/AuthStore.js');
var ErrorNotice = require('../../components/common/ErrorNotice.js');
var {TextField, RaisedButton, Paper, Styles, Checkbox} = require('material-ui');
var FullWidthSection = require('../common/full-width-section.js');
var { Colors, Spacing, Typography } = Styles;

var Login = React.createClass({

    getInitialState: function() {
        return { errors: [], rememberMe: false };
    },

    componentDidMount: function() {
        AuthStore.addChangeListener(this._onChange);
    },

    componentWillUnmount: function() {
        AuthStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
        this.state.rememberMe = !this.state.rememberMe;
        console.log("onchange called?");
    },

    _onSubmit: function(e) {
        e.preventDefault();
        this.setState({ errors: [] });
        var userIdEmail = this.refs.userIdEmail.getDOMNode().value;
        var password = this.refs.password.getDOMNode().value;
        var rememberMe = this.refs.rememberMe.getDOMNode().checked;
        console.log('userIdEmail', userIdEmail);
        console.log('password', password);
        console.log('rememberMe', rememberMe);
        AuthActionCreators.login(userIdEmail, password, rememberMe);
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
                        <div style={styles.rememberMe}>
                        <Checkbox
                            name="rememberMe"
                            value="rememberMe"
                            ref="rememberMe"
                            onCheck={this._onChange}
                            label="Remember Me"
                            />
                        </div>
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
            },
            rememberMe: {
                width: '15%',
                margin: 'auto',
                paddingTop: '10px'

            }
        };
    }
});

module.exports = Login;
