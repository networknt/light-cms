/*
 * Copyright 2015 Network New Technologies Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var keyMirror = require('react/lib/keyMirror');

var host = "example";

module.exports = {
    APIRoot:  '/api/rs',
    ClientId: 'example@Browser',
    host: host,

    ChangeEvents: {
        ROUTE_CHANGE_EVENT: 'routeChange',
        BLOG_CHANGE_EVENT: 'blogChange',
        MENU_CHANGE_EVENT: 'menuChange'
    },

    ActionTypes: keyMirror({
        // Routes
        REDIRECT: null,
        SIGNUP_REQUEST: null,
        SIGNUP_RESPONSE: null,
        INIT: null,
        LOGIN_REQUEST: null,
        LOGIN_RESPONSE: null,
        LOGOUT: null,
        REFRESH: null,
        MENU_RESPONSE: null,
        BLOGS_RESPONSE: null,
        BLOG_POSTS_RESPONSE: null,
        BLOG_POST_RESPONSE: null,

        // Commerce
        RECEIVE_CATALOG: null,
        RECEIVE_PRODUCTS: null,
        ADD_PRODUCT_TO_CART: null,
        SET_PRODUCT_VARIANT: null, // set product variation
        SET_QTY: null,
        REMOVE_CART_ITEM: null,
        SET_PRODUCT_INVENTORY: null,
        REMOVE_ONE_FROM_INVENTORY: null,
        TOGGLE_CART: null, // Open/close cart
        LOAD_CATALOG: null,
        SELECT_CATALOG: null,
        LOAD_PRODUCTS: null
    }),

    APIEndpoints: {
        SIGNIN:         {
            category : 'user',
            name : 'signInUser',
            readOnly: false
        },
        REGISTRATION:   {

        },
        GETMENU: {
            category : 'menu',
            name : 'getMenu',
            readOnly: true,
            data : {
                host : host
            }
        }
    },

    monthNames: ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

};