/* jshint node: true, devel: true */
'use strict';

const
  Q = require('q'),
  _ = require('underscore'),
  request = require('request');

var ExchangeController = function(constants) {
  console.log(constants);
  this.constants = constants;
};

_.extend(ExchangeController.prototype, {
  generateElement: function() {
    var self = this;

    return this.getData().then(function(data) {
      var data = JSON.parse(data);

      var title = data['base'] + " -> CAD : " + data['rates']['CAD'];
      var subtitle = data['date'];

      var server = self.constants.SERVER_URL;

      console.log(server);

      return {
        title: title,
        subtitle: subtitle,
        item_url: "",
        image_url: self.constants.SERVER_URL + "/assets/exchange.png",
        buttons: [{
          type: "web_url",
          url: "http://www.xe.com/currencycharts/?from=USD&to=CAD",
          title: "View More"
        }],
      };
    });
  },

  getData: function() {
    var deferred = Q.defer();

    request({
      uri: 'http://api.fixer.io/latest?base=USD&symbols=CAD',
      method: 'GET',
    }, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        deferred.resolve(body);
      } else {
        throw error;
      }
    });

    return deferred.promise;
  }
});

module.exports = ExchangeController;
