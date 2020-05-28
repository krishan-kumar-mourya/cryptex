var axios = require('axios');

module.exports = function(app) {

    app.get('/', function(req, res){
        // Make a request to get coinlist
        var url = 'https://www.cryptocompare.com/api/data/coinlist/';
        axios.get(url)
            .then(function (response) {
                coins = [];
                for (var c in response.data.Data) {
                    coins[response.data.Data[c].SortOrder-1] = response.data.Data[c];
                }
                res.render('pages/index', { coins: coins });
            })
            .catch(function (error) {
                res.render('pages/error', { error: error });
            });
    });
    
    app.get('/coin/:coin', function (req, res) {
        res.render('pages/coin', {coin : req.params.coin});
    });
    
    app.get('/design/:coin', function (req, res) {
        res.render('pages/design', { coin: req.params.coin });
    });
    
}