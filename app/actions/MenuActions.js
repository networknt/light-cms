/**
 * Created by steve on 08/07/15.
 */
var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');
var $ = require('jquery');

var ActionTypes = AppConstants.ActionTypes;

module.exports = {

    getMenu: function() {

        $.ajax({
            type: 'POST',
            url: 'http://demo.networknt.com:8080/api/rs',
            data: JSON.stringify({
                category : 'menu',
                name : 'getMenu',
                readOnly: true,
                "data": {
                    host: AppConstants.host
                }
            }),
            contentType: 'application/json',
            dataType: 'json',
            error: function(jqXHR, status, error) {
                console.log('MenuActions.getMenu error', error);
                /*
                var errorText = jqXHR.responseText;
                AppDispatcher.handleAction({
                    type: ActionTypes.SIGNUP_RESPONSE,
                    json: null,
                    error: errorText
                });
                */
            },
            success: function(result, status, xhr) {
                console.log("MenuActions.getMenu success", result);
                AppDispatcher.handleAction({
                    type: ActionTypes.MENU_RESPONSE,
                    json: result,
                    error: null
                });
            }
        });
    }
};

