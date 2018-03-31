/**
 * Created by steve on 12/08/15.
 */
'use strict';

var AppDispatcher = require('../dispatcher/AppDispatcher.js');
var AppConstants = require('../constants/AppConstants.js');
var WebAPIUtils = require('../utils/WebAPIUtils.js');

var MockProducts = require('../mock/MockProducts');

var ActionTypes = AppConstants.ActionTypes;

module.exports = {

    setProductVariant: function(variant) {
        console.log('ProductActionCreator setProductVariant', variant);
        AppDispatcher.dispatch({
            type: ActionTypes.SET_PRODUCT_VARIANT,
            index: variant.index,
            variantIndex: variant.variantIndex
        });
    },
    /*
    removeOneFromInventory: function(product) {
        AppDispatcher.dispatch({
            type: ActionTypes.REMOVE_ONE_FROM_INVENTORY,
            product: product
        });
    },

    setInventory: function (productIndex, initialInventory, qty) {
        AppDispatcher.dispatch({
            type: ActionTypes.SET_PRODUCT_INVENTORY,
            productIndex: productIndex,
            initialInventory: initialInventory,
            qty: qty
        });
    },
    */

    loadCatalog: function() {
        AppDispatcher.dispatch({
            type: ActionTypes.LOAD_CATALOG
        });
        WebAPIUtils.loadCatalog();
    },

    getProducts: function(rid) {
        var getCatalogProduct = {
            category: 'catalog',
            name: 'getCatalogProduct',
            readOnly: true,
            data: {
                pageSize: 10,
                pageNo: 1,
                '@rid': rid
            }
        };
        console.log('WebAPIUtils getCatalogProduct is called');
        $.ajax({
            type: 'GET',
            url: '/api/rs',
            data:  { cmd: encodeURIComponent(JSON.stringify(getCatalogProduct))}
        }).done(function(data) {
            AppDispatcher.dispatch({
                type: ActionTypes.RECEIVE_CATALOG,
                json: data,
                error: null
            });
        }).fail(function(error) {
            console.log('error', error);
            AppDispatcher.dispatch({
                type: ActionTypes.RECEIVE_CATALOG,
                json: MockProducts.getAllProducts(),
                error: null
            });
            //ServerActionCreators.receiveProducts(null, error);
        });
    }

};
