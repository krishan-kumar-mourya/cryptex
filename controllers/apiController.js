var Transaction = require('../models/transaction');

module.exports = function(app) {

    app.get('/api/getdata', function (req, res) {
        Transaction.getLatest(function (err, result) {
            if (err) throw err;
            var exchanges = {};
            result.forEach(function (data) {
                exchanges[data.exchange] = data;
            });
            res.json({ success: true, exchanges: exchanges });
        });
    });

    app.get('/api/gethour', function (req, res) {
        Transaction.getHour(function (err, result) {
            if (err) throw err;
            var exchanges = {};
            result.forEach(function (data) {
                exchanges[data.exchange] = data;
            });
            res.json({ success: true, exchanges: exchanges });
        });
    });

    app.get('/api/getday', function (req, res) {
        Transaction.getDay(function (err, result) {
            if (err) throw err;
            var exchanges = {};
            result.forEach(function (data) {
                exchanges[data.exchange] = data;
            });
            res.json({ success: true, exchanges: exchanges });
        });
    });

    app.get('/api/get_price/:minute', function (req, res) {
        var minute = req.params.minute;
        if(minute && minute > 0) {
            Transaction.getPrice(minute, function (err, result) {
                if (err) throw err;
                var exchanges = {};
                result.forEach(function (data) {
                    exchanges[data.exchange] = data;
                });
                res.json({ success: true, exchanges: exchanges });
            });
        }        
    });
}