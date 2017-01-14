/* jshint node: true, devel: true */
'use strict';

const
  Q = require('q'),
  _ = require('underscore'),
  request = require('request');

var BaseController = require('./BaseController');

var WeatherController = function(constants) {
  this.constants = constants;
};

WeatherController.prototype = _.extend(BaseController.prototype, {
  generateWeatherElement: function() {
    return this.getWeatherData().then(function(data) {
      var data = JSON.parse(data);

      var location = data.location.name + ", " + data.location.region;
      var date = data.location.localtime;
      var temp_c = data.current.temp_c;
      var condition_text = data.current.condition.text;
      var condition_image = "https:" + data.current.condition.icon;

      return {
        title: condition_text + " " + temp_c + "°C",
        subtitle: location + " " + date,
        item_url: "",
        image_url: condition_image,
        buttons: [{
          type: "web_url",
          url: "https://www.theweathernetwork.com/ca/weather/ontario/waterloo",
          title: "View More"
        }],
      };
    });
  },

  getWeatherData: function() {
    var deferred = Q.defer();

    const weatherAPIKey = this.constants.WEATHER_API_KEY;

    request({
      uri: 'http://api.apixu.com/v1/current.json?key='+weatherAPIKey+'&q=waterloo',
      method: 'GET',
    }, function(error, response, body) {
      console.log(body);
      if (!error && response.statusCode == 200) {
        console.log('resolve');
        deferred.resolve(body);
      } else {
        throw error;
      }
    });

    return deferred.promise;
  }
});

module.exports = WeatherController;
