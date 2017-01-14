/* jshint node: true, devel: true */
'use strict';

const
  CronJob   = require('cron').CronJob,
  https      = require('https'),
  constants = require('./app/constants');

const SITE = constants.SERVER_URL + '/ping';

function schedule(pattern, cb, stop){
	var j = new CronJob(pattern, cb, stop, true);
};

function monitor(pattern, site, cb, stop){
	schedule(pattern, function() {
		https.get(site);
};

var cb = function(){};
var stop = function(){};

monitor('0 30 9 * * *', SITE, cb, stop);
