"use strict";
var querystring = require('querystring');
var objectutil = require('@you21979/object-util');
var HttpApiError = require('@you21979/http-api-error');
var constant = require('./constant');
var lp = require('./system').lp;

var createParameter = function(params, options){
    return querystring.stringify(objectutil.keyMerge(params, options))
}

var createHeader = function(user_agent){
    return {
        'User-Agent': user_agent,
    };
}

var transformPair = function(pair){
    return pair.toUpperCase().replace('_', '-')
}

var createGetOption = function(url, user_agent, qs, timeout){
    return {
        url: url + '?' + qs,
        method: 'GET',
        headers: createHeader(user_agent),
        timeout : Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
        forever : constant.OPT_KEEPALIVE,
        transform2xxOnly : true,
        transform : function(body){
            return JSON.parse(body)
        },
    };
}

var PublicApi = exports;

var query = PublicApi.query = function(method, params, options){
    var user_agent = '';
    var url = constant.OPT_RESTAPI_URL;
    return lp.req(createGetOption(url + '/' + method, user_agent, createParameter(params, options))).
        then(function(v){
            if(v.success === true){
                return v['result'];
            }else{
                var error_code = v.message;
                throw new HttpApiError(v.message, "API", error_code, v);
            }
        });
}

PublicApi.getMarkets = function(){
    return query('public/getmarkets')
}

PublicApi.getCurrencies = function(){
    return query('public/getcurrencies')
}

PublicApi.getTicker = function(pair){
    return query('public/getticker', {
        market : transformPair(pair),
    })
}

PublicApi.getMarketSummaries = function(){
    return query('public/getmarketsummaries')
}

PublicApi.getMarketSummary = function(pair){
    return query('public/getmarketsummary', {
        market : transformPair(pair),
    })
}

PublicApi.getOrderBook = function(pair, depth){
    return query('public/getorderbook', {
        market : transformPair(pair),
        type : 'both',
        depth : depth || 20,
    })
}

PublicApi.getMarketHistory = function(pair, count){
    return query('public/getmarkethistory', {
        market : transformPair(pair),
        count : count || 20,
    })
}
