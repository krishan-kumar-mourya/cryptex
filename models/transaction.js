require('../config/db.js');

var Transaction = {

    getAll: function (callback) {
        return db.query("Select * from transaction", callback);
    },

    getById: function (id, callback) {
        return db.query("select * from transaction where id=?", [id], callback);
    },

    add: function (data, callback) {
        var sql = "INSERT INTO transaction (from_symbol, to_symbol, exchange, last_trade_id, flag, price, last_volume, last_volume_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id = id";
        return db.query(sql, [data.from_symbol, data.to_symbol, data.exchange, data.last_trade_id, data.flag, data.price, data.last_volume, data.last_volume_to], callback);
    },

    update: function (id, data, callback) {
        return db.query("update transaction set from_symbol=? where id=?", [data.from_symbol, id], callback);
    },

    delete: function (id, callback) {
        return db.query("delete from transaction where id=?", [id], callback);
    },

    getLatest: function (callback) {
        var sql = "SELECT exchange, price, last_volume, last_volume_to from transaction WHERE id IN (SELECT MAX(id) FROM transaction GROUP BY exchange) ORDER BY exchange";
        return db.query(sql, callback);
    },

    getPrice: function (minute, callback) {
        var sql = "SELECT exchange, price AS price" + minute + "minute from transaction WHERE id IN (SELECT MAX(id) FROM transaction WHERE created <= date_sub(NOW(), interval " + minute + " minute) GROUP BY exchange) ORDER BY exchange";
        return db.query(sql, callback);
    },

    get5Min: function (callback) {
        var sql = "SELECT exchange, price from transaction WHERE id IN (SELECT MAX(id) FROM transaction WHERE created <= date_sub(NOW(), interval 5 minute) GROUP BY exchange) ORDER BY exchange";
        return db.query(sql, callback);
    },

    get15Min: function (callback) {
        var sql = "SELECT exchange, price from transaction WHERE id IN (SELECT MAX(id) FROM transaction WHERE created <= date_sub(NOW(), interval 15 minute) GROUP BY exchange) ORDER BY exchange";
        return db.query(sql, callback);
    },

    get30Min: function (callback) {
        var sql = "SELECT exchange, price from transaction WHERE id IN (SELECT MAX(id) FROM transaction WHERE created <= date_sub(NOW(), interval 30 minute) GROUP BY exchange) ORDER BY exchange";
        return db.query(sql, callback);
    },

    get60Min: function (callback) {
        var sql = "SELECT exchange, price from transaction WHERE id IN (SELECT MAX(id) FROM transaction WHERE created <= date_sub(NOW(), interval 1 hour) GROUP BY exchange) ORDER BY exchange";
        return db.query(sql, callback);
    },

    getHour: function (callback) {
        var sql = "SELECT exchange, MAX(price) AS hhour, MIN(price) AS lhour from transaction WHERE created >= date_sub(NOW(), interval 1 hour) GROUP BY exchange ORDER BY exchange";
        return db.query(sql, callback);
    },

    getDay: function (callback) {
        var sql = "SELECT exchange, MAX(price) AS hday, MIN(price) AS lday, SUM(last_volume) AS volume_day, SUM(last_volume_to) AS volume_day_to from transaction WHERE created >= date_sub(NOW(), interval 1 day) GROUP BY exchange ORDER BY exchange";
        return db.query(sql, callback);
    }

};

module.exports = Transaction;