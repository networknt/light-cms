/**
 * Created by steve on 08/07/15.
 */
var AppConstants = require('../constants/AppConstants.js');
var $ = require('jquery');

function _getErrors(res) {
    var errorMsgs = ["Something went wrong, please try again"];
    var json = JSON.parse(res.text);
    if (json) {
        if (json['errors']) {
            errorMsgs = json['errors'];
        } else if (json['error']) {
            errorMsgs = [json['error']];
        }
    }
    return errorMsgs;
}

var APIEndpoints = AppConstants.APIEndpoints;
var APIRoot = AppConstants.APIRoot;
var Host = AppConstants.Host;
var ClientId = AppConstants.ClientId;

module.exports = {

    signup: function(email, username, password, passwordConfirmation) {
        request.post(APIEndpoints.REGISTRATION)
            .send({ user: {
                email: email,
                username: username,
                password: password,
                password_confirmation: passwordConfirmation,
                clientId: ClientId
            }})
            .set('Accept', 'application/json')
            .end(function(error, res) {
                if (res) {
                    if (res.error) {
                        var errorMsgs = _getErrors(res);
                        //ServerActionCreators.receiveLogin(null, errorMsgs);
                    } else {
                        json = JSON.parse(res.text);
                        //ServerActionCreators.receiveLogin(json, null);
                    }
                }
            });
    },

    login: function(userIdEmail, password, rememberMe) {
        console.log('login in WebAPIUtils is been called');

        var signIn =  {
            category : 'user',
            name : 'signInUser',
            readOnly: false,
            data: {
                userIdEmail: userIdEmail,
                password: password,
                rememberMe: rememberMe,
                clientId: ClientId
            }
        };


        console.log('login', signIn);
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: '/api/rs',
            data: JSON.stringify(signIn),
            dataType: 'json',
            error: function(jqXHR, status, error) {
                console.log('login error', error);
                //ServerActionCreators.receiveLogin(null, error);
            },
            success: function(result, status, xhr) {
                console.log('login success', result);
                //ServerActionCreators.receiveLogin(result, null);
            }
        });
    },

    loadMenu: function() {
        var getMenu = {
            category : 'menu',
            name : 'getMenu',
            readOnly: true,
            data : {
                host : Host
            }

        }
        console.log('WebAPIUtils loadMenus is called', getMenu);
        $.ajax({
            type: 'POST',
            url: '/api/rs',
            data: JSON.stringify(getMenu),
            contentType: 'application/json',
            dataType: 'json'
        }).done(function(data) {
            console.log('getMenu done', data);
            //ServerActionCreators.receiveMenu(data, null);
        }).fail(function(error) {
            console.log('error', error);
            //ServerActionCreators.receiveMenu(null, error);
        });
    },

    loadBlogs: function() {
        var getBlogs = {
            category: 'demo',
            name: 'getDropdown',
            readOnly: true
        }
        console.log('WebAPIUtils logBlogs is called');
        $.ajax({
            type: 'GET',
            url: '/api/rs',
            data:  { cmd: encodeURIComponent(JSON.stringify(getBlogs))}
        }).done(function(data) {
            console.log('done', data);
            //ServerActionCreators.receiveBlogs(data, null);

        }).fail(function(error) {
            console.log('error', error);
            //ServerActionCreators.receiveBlogs(null, error);
        });
    },

    loadBlog: function(blogId) {
        request.get(APIEndpoints.STORIES + '/' + storyId)
            .set('Accept', 'application/json')
            .end(function(error, res){
                if (res) {
                    var json = JSON.parse(res.text);
                    //ServerActionCreators.receiveBlog(json);
                }
            });
    },

    createBlog: function(title, body) {
        request.post(APIEndpoints.STORIES)
            .set('Accept', 'application/json')
            .send({ blog: { title: title, body: body } })
            .end(function(error, res){
                if (res) {
                    if (res.error) {
                        var errorMsgs = _getErrors(res);
                        //ServerActionCreators.receiveCreatedBlog(null, errorMsgs);
                    } else {
                        var json = JSON.parse(res.text);
                        //ServerActionCreators.receiveCreatedBlog(json, null);
                    }
                }
            });
    },

    loadCatalog: function() {
        var getCatalogTree = {
            category: 'catalog',
            name: 'getCatalogTree',
            readOnly: true,
            data: {
                host: AppConstants.host
            }
        };

        console.log('WebAPIUtils loadCatalog is called', getCatalogTree);
        $.ajax({
            type: 'GET',
            url: '/api/rs',
            data:  { cmd: encodeURIComponent(JSON.stringify(getCatalogTree))}
        }).done(function(data) {
            console.log('catalog', data);
            //ServerActionCreators.receiveCatalog(data, null);
        }).fail(function(error) {
            console.log('error', error);
            //ServerActionCreators.receiveCatalog(null, error);
        });
    },

    loadProducts: function(rid) {

    }
};
