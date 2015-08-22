/**
 * Created by steve on 08/07/15.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var ActionTypes = AppConstants.ActionTypes;

module.exports = {

    signup: function(email, username, password, passwordConfirmation) {
        AppDispatcher.handleAction({
            type: ActionTypes.SIGNUP_REQUEST,
            email: email,
            username: username,
            password: password,
            passwordConfirmation: passwordConfirmation
        });
        WebAPIUtils.signup(email, username, password, passwordConfirmation);
    },

    login: function(userIdEmail, password, rememberMe) {
        AppDispatcher.handleAction({
            type: ActionTypes.LOGIN_REQUEST,
            userIdEmail: userIdEmail,
            password: password,
            rememberMe: rememberMe
        });
        console.log('WebAPIUtils', WebAPIUtils);
        WebAPIUtils.login(userIdEmail, password, rememberMe);
    },

    init: function() {
        console.log('the inti action is called', AppDispatcher);
        AppDispatcher.handleAction({
            type: ActionTypes.INIT
        });
    },

    refresh: function(accessToken) {
        console.log('refresh in AuthActionCreators is called.');
        AppDispatcher.handleAction({
            type: ActionTypes.REFRESH,
            accessToken: accessToken
        });
    },

    logout: function() {
        AppDispatcher.handleAction({
            type: ActionTypes.LOGOUT
        });
    }

};

