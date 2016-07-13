var bittrex = require('..')
var api = bittrex.PublicApi;

api.getOrderBook("BTC-XRP").then(function(res){
    return {
        asks : res.sell.map(function(v){ return [v.Rate, v.Quantity] }),
        bids : res.buy.map(function(v){ return [v.Rate, v.Quantity] }),
    }
}).then(console.log)



