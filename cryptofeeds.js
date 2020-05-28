var CCC = require('./ccc-streamer-utilities.js');
var Transaction = require("./models/transaction");

// Create a socket client
var socket = require('socket.io-client')('wss://streamer.cryptocompare.com');
socket.on('connect', function(){
    console.log("Connected to Socket");
});
var subscription = ['5~CCCAGG~BTC~USD'];
socket.emit('SubAdd', { subs: subscription });
socket.on('event', function(data){
    console.log("data", data);
});
socket.on("m", function(message) {
    var messageType = message.substring(0, message.indexOf("~"));
    var res = {};
    if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);
        dataUnpack(res);
    }
});
socket.on('disconnect', function(){
    console.log("Disconnected from Socket");
});

var oldPrice = null;
var dataUnpack = function(data) {
    if (!oldPrice) {
        oldPrice = data;
    }
    var currentPrice = {};
    var from = data['FROMSYMBOL'];
    var to = data['TOSYMBOL'];
    var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
    var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
    var pair = from + to;

    for (var key in oldPrice) {
        currentPrice[key] = data[key] || oldPrice[key];
    }
    oldPrice = currentPrice;

    if (currentPrice['LASTTRADEID']) {
        currentPrice['LASTTRADEID'] = parseInt(currentPrice['LASTTRADEID']).toFixed(0);
    }
    currentPrice['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice['PRICE'] - currentPrice['OPEN24HOUR']));
    currentPrice['CHANGE24HOURPCT'] = ((currentPrice['PRICE'] - currentPrice['OPEN24HOUR']) / currentPrice['OPEN24HOUR'] * 100).toFixed(2) + "%";;
    saveData(currentPrice, from, tsym, fsym);
};

var saveData = function(current, from, tsym, fsym) {
    data = {    
        from_symbol: current.FROMSYMBOL,
        to_symbol: current.TOSYMBOL,
        exchange: current.LASTMARKET,
        last_trade_id: current.LASTTRADEID,
        flag: current.FLAGS,
        last_volume: current.LASTVOLUME,
        last_volume_to: current.LASTVOLUMETO
    };
    data.price = Math.round(data.last_volume_to/data.last_volume * 100) / 100;

    Transaction.add(data, function (err, result) {
        if (err) throw err;
    });
};