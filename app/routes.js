/* jshint node: true, devel: true */
'use strict';

var Q = require('q');

var routes = function(app, alfred) {
  const constants = app.get('constants');
  /*
   * Check that the token used in the Webhook setup is the same token used here.
   *
   */
  app.get('/webhook', function(req, res) {
    if (req.query['hub.mode'] === 'subscribe' &&
        req.query['hub.verify_token'] === constants.VALIDATION_TOKEN) {
      console.log("Validating webhook");
      res.status(200).send(req.query['hub.challenge']);
    } else {
      console.error("Failed validation. Make sure the validation tokens match.");
      res.sendStatus(403);
    }
  });

  /*
   * All callbacks for Messenger are POST-ed. They will be sent to the same
   * webhook. Be sure to subscribe your app to your page to receive callbacks
   * for your page.
   * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
   *
   */
  app.post('/webhook', function (req, res) {
    var data = req.body;
    // Make sure this is a page subscription
    if (data.object == 'page') {
      // Iterate over each entry
      // There may be multiple if batched
      data.entry.forEach(function(pageEntry) {
        var pageID = pageEntry.id;
        var timeOfEvent = pageEntry.time;

        // Iterate over each messaging event
        pageEntry.messaging.forEach(function(messagingEvent) {
          if (messagingEvent.message) {
            alfred.receivedMessage(messagingEvent);
          } else {
            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
          }
        });
      });

      // Assume all went well.
      //
      // You must send back a 200, within 20 seconds, to let us know you've
      // successfully received the callback. Otherwise, the request will time out.
      res.sendStatus(200);
    }
  });

  app.get('/ping', function (req, res) {
      alfred.sendTextMessage(
        constants.RECIPIENT_ID,
        "Good morning Paul. Here are your updates for today:"
      );

      alfred.sendBatchMessage(constants.RECIPIENT_ID);

      res.sendStatus(200);
  });
}

module.exports = routes;
