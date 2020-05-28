var pageController = require('../controllers/pageController');
var apiController = require('../controllers/apiController');

module.exports = function(app) {
    pageController(app);
    apiController(app);
}