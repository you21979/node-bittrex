var bittrex = require('..')
var api = bittrex.PublicApi;

api.getMarketSummaries().then(function(res){
    return res.map(function(v){ return [v['MarketName'].split("-").reverse().join("_"), v['Last']] })
}).then(console.log)



