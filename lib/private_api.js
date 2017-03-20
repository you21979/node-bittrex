"use strict";
var verify = require('@you21979/simple-verify')
var objectutil = require('@you21979/object-util');
var HttpApiError = require('@you21979/http-api-error');
var querystring = require('querystring');
var constant = require('./constant');
var lp = require('./system').lp;

var createHeader = function(secret_key, user_agent, data){
    return {
        'User-Agent': user_agent,
        'apisign': verify.sign('sha512', secret_key, data),
    };
}

var createGetOption = function(url, nonce, api_key, secret_key, user_agent, timeout, method, params){
    var qs = querystring.stringify(objectutil.keyMerge({apikey:api_key, nonce:nonce}, params));
    var fullurl = url + '/' + method + '?' + qs;
    return {
        url: fullurl,
        method: 'GET',
        forever : constant.OPT_KEEPALIVE,
        headers: createHeader(secret_key, user_agent, fullurl),
        timeout: timeout,
        transform2xxOnly: true,
        transform: function(body){
            return JSON.parse(body)
        },
    };
}

var TradeApi = function(api_key, secret_key, user_agent){
    this.name = 'BITTREX';
    this.url = constant.OPT_TRADEAPI_URL;
    this.timeout = Math.floor(constant.OPT_TIMEOUT_SEC * 1000);
    this.nonce = new Date() * 1;
    this.api_key = api_key;
    this.secret_key = secret_key;
    this.user_agent = user_agent;
}

TradeApi.prototype.query = function(method, mustparams, options){
    var params = objectutil.keyMerge(mustparams, options);
    return lp.req(createGetOption(this.url, this.incrementNonce(), this.api_key, this.secret_key, this.user_agent, this.timeout, method, params)).
        then(function(v){
            if(v.success === true){
                return v['result'];
            }else{
                var error_code = 0;//(v.error).toUpperCase().replace(' ', '_');
                throw new HttpApiError(v.message, "API", error_code, v);
            }
        });

}
TradeApi.prototype.incrementNonce = function(){
    return ++this.nonce;
}

TradeApi.prototype.getBalances = function(options){
    return this.query("account/getbalances", {}, options || {})
}

TradeApi.prototype.getBalance = function(currency, options){
    return this.query("account/getbalance", {
        currency : currency.toUpperCase(),
    }, options || {})
}

TradeApi.prototype.getDepositAddress = function(currency, options){
    return this.query("account/getdepositaddress", {
        currency : currency.toUpperCase(),
    }, options || {})
}

TradeApi.prototype.withdraw = function(currency, quantity, address, paymentid, options){
    return this.query("account/withdraw", {
        currency : currency.toUpperCase(),
        quantity : quantity,
        address : address,
        paymentid : paymentid || "",
    }, options || {})
}

TradeApi.prototype.getOrder = function(uuid, options){
    return this.query("account/getorder", {
        uuid : uuid,
    }, options || {})
}

TradeApi.prototype.getOrderHistory = function(options){
    return this.query("account/getorderhistory", {}, options || {})
}

TradeApi.prototype.getWithdrawalHistory = function(options){
    return this.query("account/getwithdrawalhistory", {}, options || {})
}

TradeApi.prototype.getDepositHistory = function(options){
    return this.query("account/getdeposithistory", {}, options || {})
}

TradeApi.prototype.buyLimit = function(market, quantity, rate, options){
    return this.query("market/buylimit", {
        market : market,
        quantity : quantity,
        rate : rate,
    }, options || {})
}

TradeApi.prototype.buyMarket = function(market, quantity, options){
    return this.query("market/buymarket", {
        market : market,
        quantity : quantity,
    }, options || {})
}

TradeApi.prototype.sellLimit = function(market, quantity, rate, options){
    return this.query("market/selllimit", {
        market : market,
        quantity : quantity,
        rate : rate,
    }, options || {})
}

TradeApi.prototype.sellMarket = function(market, quantity, options){
    return this.query("market/sellmarket", {
        market : market,
        quantity : quantity,
    }, options || {})
}

TradeApi.prototype.cancel = function(uuid, options){
    return this.query("market/cancel", {
        uuid : uuid,
    }, options || {})
}

TradeApi.prototype.getOpenOrders = function(options){
    return this.query("market/getopenorders", {}, options || {})
}

var createPrivateApi = module.exports = function(api_key, secret_key, user_agent){
    return new TradeApi(api_key, secret_key, user_agent)
}

