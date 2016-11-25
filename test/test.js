'use strict';
var assert = require('power-assert');
var les = require("local-echoserver");
var verify = require("@you21979/simple-verify");
var qstring = require("querystring");
var Promise = require("bluebird");
var btx = require('..');

describe('test', function () {
    describe('private api test', function () {
        var constant = btx.Constant;
        var config = {apikey : "",secretkey : "", useragent : "tradebot"}
        before(function() {
            return verify.createKeyPair().then(function(res){
                config.apikey = res.key
                config.secretkey = res.secret
            })
        })
        it('getBalances and auth', function () {
            return les(function(url){
                constant.OPT_TRADEAPI_URL = url + '/api/v1.1'
                var papi = btx.createPrivateApi(config.apikey, config.secretkey, config.useragent);
                return papi.getBalances()
            }, function(res, headers, method, url, body){
                assert(method === 'GET');
                assert(headers['user-agent'] === config.useragent)
                assert(headers['apisign'])
                var qs = url.split('?') 
                var param = qstring.parse(qs[1])
                assert(param.apikey === config.apikey);
                assert(param.nonce);
                var result = JSON.stringify({
                    success : true,
                    message : "",
                    result : [{
                            "Currency" : "DOGE",
                            "Balance" : 0.00000000,
                            "Available" : 0.00000000,
                            "Pending" : 0.00000000,
                            "CryptoAddress" : "DLxcEt3AatMyr2NTatzjsfHNoB9NT62HiF",
                            "Requested" : false,
                            "Uuid" : null

                        }, {
                            "Currency" : "BTC",
                            "Balance" : 14.21549076,
                            "Available" : 14.21549076,
                            "Pending" : 0.00000000,
                            "CryptoAddress" : "1Mrcdr6715hjda34pdXuLqXcju6qgwHA31",
                            "Requested" : false,
                            "Uuid" : null
                        }]
                });
                res.end(result);
            })
        })
    })
    describe('public api test', function () {
        var constant = btx.Constant;
        var api = btx.PublicApi;
        it('getOrderBook', function () {
            return les(function(url){
                constant.OPT_RESTAPI_URL = url + '/api/v1.1'
                return api.getOrderBook('BTC_DOGE', 10)
            }, function(res, headers, method, url, body){
                assert(method === 'GET');
                assert(url === '/api/v1.1/public/getorderbook?market=BTC-DOGE&type=both&depth=10');
                var result = JSON.stringify({
                    "success" : true,
                    "message" : "",
                    "result" : {
                        "buy" : [{
                                "Quantity" : 12.37000000,
                                "Rate" : 0.02525000
                            }
                        ],
                        "sell" : [{
                                "Quantity" : 32.55412402,
                                "Rate" : 0.02540000
                            }, {
                                "Quantity" : 60.00000000,
                                "Rate" : 0.02550000
                            }, {
                                "Quantity" : 60.00000000,
                                "Rate" : 0.02575000
                            }, {
                                "Quantity" : 84.00000000,
                                "Rate" : 0.02600000
                            }
                        ]
                    }
                });
                res.end(result);
            })
        })
        it('getTicker', function () {
            return les(function(url){
                constant.OPT_RESTAPI_URL = url + '/api/v1.1'
                return api.getTicker('BTC-LTC')
            }, function(res, headers, method, url, body){
                assert(method === 'GET');
                assert(url === '/api/v1.1/public/getticker?market=BTC-LTC');
                var result = JSON.stringify({
                    "success" : true,
                    "message" : "",
                    "result" : {
                        "Bid" : 2.05670368,
                        "Ask" : 3.35579531,
                        "Last" : 3.35579531
                    }
                });
                res.end(result);
            })
        })
    })
})
