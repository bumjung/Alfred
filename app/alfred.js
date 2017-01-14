/* jshint node: true, devel: true */
'use strict';

const
  Q = require('q'),
  _ = require('underscore'),
  request = require('request');

var Alfred = function (app, weatherController) {
  this.app = app;
  this.weatherController = weatherController;
  this.constants = app.get('constants');
};

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 */
_.extend(Alfred.prototype, {
  receivedMessage: function(event) {
    var senderID = event.sender.id;
    var recipientID = event.recipient.id;
    var timeOfMessage = event.timestamp;
    var message = event.message;

    console.log("Received message for user %d and page %d at %d with message:",
      senderID, recipientID, timeOfMessage);
    console.log(JSON.stringify(message));

    var messageId = message.mid;
    var appId = message.app_id;
    var metadata = message.metadata;

    // You may get a text or attachment but not both
    var messageText = message.text;
    if (messageText) {

      // If we receive a text message, check to see if it matches any special
      // keywords and send back the corresponding example. Otherwise, just echo
      // the text we received.
      messageText = messageText.toLowerCase();
      switch (messageText) {
        case 'batch':
          this.sendBatchMessage(senderID);
          break;
        case 'weather':
          this.sendWeatherMessage(senderID);
          break;
        case 'who is the real batman':
          this.sendTextMessage(senderID, 'You are the real Batman');
          break;
        default:
          this.sendTextMessage(senderID, messageText);
      }
    }
  },

  /*
   * Send a text message using the Send API.
   *
   */
   sendTextMessage: function(recipientId, messageText) {
    var messageData = {
      recipient: {
        id: recipientId
      },
      message: {
        text: messageText,
        metadata: "METADATA_PLACEHOLDER"
      }
    };

    this.callSendAPI(messageData);
  },

  /*
   * Send a Structured Message (Generic Message type) using the Send API.
   *
   */
  sendBatchMessage: function(recipientId) {
    var self = this;

    // TODO: batch different data

    this.weatherController.generateWeatherElement().then(function(weatherElement) {
      var messageData = self.createMessageData(recipientId, [weatherElement]);

      self.callSendAPI(messageData);
    });
  },

  sendWeatherMessage: function(recipientId) {
    var self = this;
    this.weatherController.generateWeatherElement().then(function(weatherElement) {
      var messageData = self.createMessageData(recipientId, [weatherElement]);

      self.callSendAPI(messageData);
    });
  },

  createMessageData: function(recipientId, elements) {
    return {
      recipient: {
        id: recipientId
      },
      message: {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: elements,
          }
        }
      }
    };
  },

  /*
   * Call the Send API. The message data goes in the body. If successful, we'll
   * get the message id in a response
   *
   */
  callSendAPI: function(messageData) {
    var self = this;
    request({
      uri: 'https://graph.facebook.com/v2.6/me/messages',
      qs: { access_token: self.constants.PAGE_ACCESS_TOKEN },
      method: 'POST',
      json: messageData

    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var recipientId = body.recipient_id;
        var messageId = body.message_id;

        if (messageId) {
          console.log("Successfully sent message with id %s to recipient %s",
            messageId, recipientId);
        } else {
        console.log("Successfully called Send API for recipient %s",
          recipientId);
        }
      } else {
        console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
      }
    });
  },
});

module.exports = Alfred;
