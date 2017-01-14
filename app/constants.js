/* jshint node: true, devel: true */
'use strict';

const config = require('config');

// App Secret can be retrieved from the App Dashboard
const APP_SECRET = (process.env.MESSENGER_APP_SECRET) ?
  process.env.MESSENGER_APP_SECRET :
  config.get('appSecret');

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = (process.env.MESSENGER_VALIDATION_TOKEN) ?
  (process.env.MESSENGER_VALIDATION_TOKEN) :
  config.get('validationToken');

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = (process.env.MESSENGER_PAGE_ACCESS_TOKEN) ?
  (process.env.MESSENGER_PAGE_ACCESS_TOKEN) :
  config.get('pageAccessToken');

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = (process.env.SERVER_URL) ?
  (process.env.SERVER_URL) :
  config.get('serverURL');

const WEATHER_API_KEY = (process.env.WEATHER_API_KEY) ?
  (process.env.WEATHER_API_KEY) :
  config.get('weatherAPIKey');

const RECIPIENT_ID = (process.env.RECIPIENT_ID) ?
  (process.env.RECIPIENT_ID) :
  config.get('myRecipientId');

if (!(APP_SECRET
    && VALIDATION_TOKEN
    && PAGE_ACCESS_TOKEN
    && SERVER_URL
    && WEATHER_API_KEY
    && RECIPIENT_ID)) {
  console.error("Missing config values");
  process.exit(1);
}

module.exports = {
  APP_SECRET: APP_SECRET,
  VALIDATION_TOKEN: VALIDATION_TOKEN,
  PAGE_ACCESS_TOKEN: PAGE_ACCESS_TOKEN,
  SERVER_URL: SERVER_URL,
  WEATHER_API_KEY: WEATHER_API_KEY,
  RECIPIENT_ID: RECIPIENT_ID,
};
