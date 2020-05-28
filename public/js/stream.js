// $(document).ready(function() {

// 	var currentPrice = {};
// 	var socket = io.connect('https://streamer.cryptocompare.com/');
// 	//Format: {SubscriptionId}~{ExchangeName}~{FromSymbol}~{ToSymbol}
// 	//Use SubscriptionId 0 for TRADE, 2 for CURRENT and 5 for CURRENTAGG
// 	//For aggregate quote updates use CCCAGG as market
// 	var subscription = ['5~CCCAGG~' + COIN +'~USD'];
// 	socket.emit('SubAdd', { subs: subscription });
// 	socket.on("m", function(message) {
// 		var messageType = message.substring(0, message.indexOf("~"));
// 		var res = {};
// 		if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
// 			res = CCC.CURRENT.unpack(message);
// 			dataUnpack(res);
// 		}
// 	});

// 	var oldPrice = null;
// 	var dataUnpack = function(data) {
// 		if (!oldPrice) {
// 			oldPrice = data;
// 		}
// 		var currentPrice = {};
// 		var from = data['FROMSYMBOL'];
// 		var to = data['TOSYMBOL'];
// 		var fsym = CCC.STATIC.CURRENCY.getSymbol(from);
// 		var tsym = CCC.STATIC.CURRENCY.getSymbol(to);
// 		var pair = from + to;

// 		for (var key in oldPrice) {
// 			currentPrice[key] = data[key] || oldPrice[key];
// 		}
// 		oldPrice = currentPrice;

// 		if (currentPrice['LASTTRADEID']) {
// 			currentPrice['LASTTRADEID'] = parseInt(currentPrice['LASTTRADEID']).toFixed(0);
// 		}
// 		currentPrice['CHANGE24HOUR'] = CCC.convertValueToDisplay(tsym, (currentPrice['PRICE'] - currentPrice['OPEN24HOUR']));
// 		currentPrice['CHANGE24HOURPCT'] = ((currentPrice['PRICE'] - currentPrice['OPEN24HOUR']) / currentPrice['OPEN24HOUR'] * 100).toFixed(2) + "%";;
// 		displayData(currentPrice, from, tsym, fsym);
// 	};

// 	var displayData = function(current, from, tsym, fsym) {
// 		var priceDirection = current.FLAGS;
// 		for (var key in current) {
// 			if (key == 'LASTVOLUMETO' || key == 'VOLUME24HOURTO') {
// 				current[key+'_f'] = CCC.convertValueToDisplay(tsym, current[key]);
// 			} else if (key == 'LASTVOLUME' || key == 'VOLUME24HOUR' || key == 'OPEN24HOUR' || key == 'OPENHOUR' || key == 'HIGH24HOUR' || key == 'HIGHHOUR' || key == 'LOWHOUR' || key == 'LOW24HOUR') {
// 				current[key+'_f'] = CCC.convertValueToDisplay(fsym, current[key]);
// 			} else if (key == 'PRICE') {
// 				$('#' + key + '_' + from).text(current[key]);
// 			}
// 		}

// 		$('#PRICE_' + from).removeClass();
// 		if (priceDirection & 1) {
// 			$('#PRICE_' + from).addClass("up");
// 		}
// 		else if (priceDirection & 2) {
// 			$('#PRICE_' + from).addClass("down");
// 		}
// 		angular.element(document.querySelector('#panel-body')).scope().vm.update(current);
// 	};
// });

angular.module('cryptex', []).controller('CryptexController', cryptexController);

function cryptexController($scope, $http) {
	this.exchanges = {};
	this.update = function(exchange) {
		this.exchanges[exchange.LASTMARKET] = exchange;
		angular.element(document.querySelector('#panel-body')).scope().$apply();
	}

	$scope.customChange = "0";
	$scope.exchanges = {};
	$scope.exchange = "";

	$scope.getData = function () {
		$http.get("/api/getdata").then(response => {
			response = response.data;
			if(response.success) {
				var data = response.exchanges;
				var price = 0;
				Object.keys(data).forEach(k => {
					if (!$scope.exchanges[data[k].exchange]) {
						$scope.exchanges[data[k].exchange] = data[k];
					}
					$scope.exchanges[data[k].exchange].price = data[k].price;
					$scope.exchanges[data[k].exchange].last_volume = data[k].last_volume;
					$scope.exchanges[data[k].exchange].last_volume_to = data[k].last_volume_to;
					price += data[k].price*1;
				});
				$scope.price_old = $scope.price;
				$scope.price = price / Object.keys($scope.exchanges).length;
			}

			setTimeout($scope.getData, 5000);
		});
	}

	$scope.getData();

	$scope.getHour = function () {
		$http.get("/api/gethour").then(response => {
			response = response.data;
			if (response.success) {
				var data = response.exchanges;
				Object.keys(data).forEach(k => {
					if (!$scope.exchanges[data[k].exchange]) {
						$scope.exchanges[data[k].exchange] = data[k];
					}
					$scope.exchanges[data[k].exchange].hhour = data[k].hhour;
					$scope.exchanges[data[k].exchange].lhour = data[k].lhour;
				});
			}
			
			setTimeout($scope.getHour, 10000);
		});
	}

	$scope.getHour();

	$scope.getDay = function () {
		$http.get("/api/getday").then(response => {
			response = response.data;
			if (response.success) {
				var data = response.exchanges;
				Object.keys(data).forEach(k => {
					if (!$scope.exchanges[data[k].exchange]) {
						$scope.exchanges[data[k].exchange] = data[k];
					}
					$scope.exchanges[data[k].exchange].hday = data[k].hday;
					$scope.exchanges[data[k].exchange].lday = data[k].lday;
					$scope.exchanges[data[k].exchange].volume_day = data[k].volume_day;
					$scope.exchanges[data[k].exchange].volume_day_to = data[k].volume_day;
				});
			}

			setTimeout($scope.getDay, 15000);
		});
	}

	$scope.getDay();

	$scope.getPrice = function (minute, repeatTime) {
		if(minute > 0) {
			$http.get("/api/get_price/" + minute).then(response => {
				response = response.data;
				if (response.success) {
					var data = response.exchanges;
					var price_key = "price" + minute + "minute"
					Object.keys(data).forEach(k => {
						if (!$scope.exchanges[data[k].exchange]) {
							$scope.exchanges[data[k].exchange] = data[k];
						}
						$scope.exchanges[data[k].exchange][price_key] = data[k][price_key];
					});
				}

				setTimeout($scope.getPrice, repeatTime, minute, repeatTime);
			});
		}
	}

	$scope.showCustomChange = function () {
		$scope.getPrice($scope.customChange, 65*1000);
	}

	$scope.getPrice(5, 10*1000);
	$scope.getPrice(15, 16*1000);
	$scope.getPrice(30, 33*1000);
	$scope.getPrice(60, 61*1000);
}