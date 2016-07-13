var bittrex = require('..')
var fs = require('fs');

var config = JSON.parse(fs.readFileSync("./account.json", "utf8"));

var api = bittrex.createPrivateApi(config.APIKEY, config.SECRET, "")
api.getBalances().then(function(res){
    console.log(res)
})


