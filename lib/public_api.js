"use strict";
var querystring = require('querystring');
var constant = require('./constant');
var lp = require('./system').lp;

var createParameter = function(params){
    var w = [];
    Object.keys(params).forEach(function(k){
        w.push([k, params[k]].join('='))
    })
    return w.join('&');
}

var createHeader = function(user_agent){
    return {
        'User-Agent': user_agent,
    };
}

var createGetOption = function(url, user_agent, qs){
    return {
        url: url + '?' + qs,
        method: 'GET',
        headers: createHeader(user_agent),
        timeout : Math.floor(constant.OPT_TIMEOUT_SEC * 1000),
        transform : function(body){
            return JSON.parse(body)
        },
    };
}

var PublicApi = exports;

var query = PublicApi.query = function(method, params){
    var user_agent = '';
    var url = constant.OPT_RESTAPI_URL;
    return lp.req(createGetOption(url + '/' + method, user_agent, createParameter(params || {}))).
        then(function(res){
            if(res.success === true) return res.result;
            else throw(new Error(res.message));
        });
}

PublicApi.getMarkets = function(){
    return query('getmarkets')
}

PublicApi.getCurrencies = function(){
    return query('getcurrencies')
}

PublicApi.getTicker = function(pair){
    return query('getticker', {
        market : pair.toLowerCase(),
    })
}

PublicApi.getMarketSummaries = function(){
    return query('getmarketsummaries')
}

PublicApi.getMarketSummary = function(pair){
    return query('getmarketsummary', {
        market : pair.toLowerCase(),
    })
}

PublicApi.getOrderBook = function(pair, depth){
    return query('getorderbook', {
        market : pair.toLowerCase(),
        type : 'both',
        depth : depth || 20,
    })
}

PublicApi.getMarketHistory = function(pair, count){
    return query('getmarkethistory', {
        market : pair.toLowerCase(),
        count : count || 20,
    })
}
