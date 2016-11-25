# node-bittrex

[![NPM](https://nodei.co/npm/@you21979/bittrex.com.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/@you21979/bittrex.com)  
[![Build Status](https://secure.travis-ci.org/you21979/node-bittrex.png?branch=master)](https://travis-ci.org/you21979/node-bittrex)
[![Coverage Status](https://coveralls.io/repos/github/you21979/node-bittrex/badge.svg?branch=master)](https://coveralls.io/github/you21979/node-bittrex?branch=master)

bittrex.com Promise-base API Wrapper

## install

```
npm i @you21979/bittrex.com
```

## api document

* https://bittrex.com/Home/Api

## public api

```
var bittrex = require('@you21979/bittrex.com')
var api = bittrex.PublicApi;
api.getMarketSummaries().then(console.log)
```

## private api

* account.json

```
{
  "APIKEY":"",
  "SECRET":""
}
```

```
var bittrex = require('@you21979/bittrex.com')
var fs = require('fs');
var config = JSON.parse(fs.readFileSync("./account.json", "utf8"));
var api = bittrex.createPrivateApi(config.APIKEY, config.SECRET, "I am Bot")
api.getBalances().then(console.log)
```

## Error Handling

* simple error control

```
api.getBalances().catch(function(e){
    console.log(e.message)
})
```

* technical error control

```
var errors = require('@you21979/bittrex.com/errors')
api.getBalances()
    .catch(errors.HttpApiError, function (reason) {
        // API ERROR
        console.log(reason.message, "API", reason.error_code)
    })
    .catch(errors.StatusCodeError, function (reason) {
        // HTTP STATUS ERROR(404 or 500, 502, etc...)
        console.log("HTTP StatusCodeError " + reason.statusCode, "HTTP", reason.statusCode)
    })
    .catch(errors.RequestError, function (reason) {
        // REQUEST ERROR(SYSTEMCALL, TIMEOUT)
        console.log(reason.message, "SYSCALL", reason.error.code)
    })
    .catch(function(e){
        // OTHER ERROR
        console.log(e.message)
    })
```

License
-------

MIT License

Donate
------

```
bitcoin:1DWLJFxmPQVSYER6pjwdaVHfJ98nM76LiN 
monacoin:MCEp2NWSFc352uaDc6nQYv45qUChnKRsKK 
```
