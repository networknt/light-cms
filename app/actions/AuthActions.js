/**
 * Created by steve on 08/07/15.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');
var $ = require('jquery');

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
        $.ajax({
            type: 'POST',
            url: 'http://example:8080/api/rs',
            data: JSON.stringify({
                category : 'user',
                name : 'signUpUser',
                readOnly: false,
                "data": {
                    email: email,
                    userId: username,
                    password: password,
                    passwordConfirm: passwordConfirmation,
                    clientId: AppConstants.ClientId
                }
            }),
            contentType: 'application/json',
            //dataType: 'json',
            error: function(jqXHR, status, error) {
                console.log('signup error', error);
                var errorText = jqXHR.responseText;
                AppDispatcher.handleAction({
                    type: ActionTypes.SIGNUP_RESPONSE,
                    json: null,
                    error: errorText
                });
            },
            success: function(result, status, xhr) {
                console.log('signup success', result);
                AppDispatcher.handleAction({
                    type: ActionTypes.SIGNUP_RESPONSE,
                    json: result,
                    error: null
                });
            }
        });
    },

    login: function(userIdEmail, password, rememberMe) {
        AppDispatcher.handleAction({
            type: ActionTypes.LOGIN_REQUEST,
            userIdEmail: userIdEmail,
            password: password,
            rememberMe: rememberMe
        });

        $.ajax({
            type: 'POST',
            url: 'http://example:8080/api/rs',
            data: JSON.stringify({
                category : 'user',
                name : 'signInUser',
                readOnly: false,
                "data": {
                    userIdEmail: userIdEmail,
                    password: password,
                    rememberMe: rememberMe,
                    clientId: AppConstants.ClientId
                }
            }),
            contentType: 'application/json',
            dataType: 'json',
            error: function(jqXHR, status, error) {
                console.log('Login error received', error, jqXHR, status);
                AppDispatcher.handleAction({
                    type: ActionTypes.LOGIN_RESPONSE,
                    json: null,
                    error: JSON.parse(jqXHR.responseText)
                });
            },
            success: function(result, status, xhr) {
                console.log('Login success received', result);
                AppDispatcher.handleAction({
                    type: ActionTypes.LOGIN_RESPONSE,
                    json: result,
                    error: null
                });
            }
        });

    },

    logout: function() {
        AppDispatcher.handleAction({
            type: ActionTypes.LOGOUT
        });
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
    }
};

