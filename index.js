var Botkit = require('botkit');
require('dotenv').config();

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET || !process.env.PORT || !process.env.VERIFICATION_TOKEN) {
  console.log('Error: Specify CLIENT_ID, CLIENT_SECRET, VERIFICATION_TOKEN and PORT in environment');
  process.exit(1);
} else {
  console.log('Good job, you have the variables!')
}

var controller = Botkit.slackbot({
 json_file_store: ‘./db_slackbutton_slash_command/’,
 debug: true,
 clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
})

controller.configureSlackApp({
 clientId: process.env.CLIENT_ID,
 clientSecret: process.env.CLIENT_SECRET,
 clientSigningSecret: process.env.CLIENT_SIGNING_SECRET,
 scopes: [‘commands’, ‘bot’],
})


controller.setupWebserver(process.env.PORT, function(err, webserver){
 controller.createWebhookEndpoints(controller.webserver);
 controller.createOauthEndpoints(controller.webserver,
   function(err, req, res) {
     if (err) {
       res.status(500).send(‘ERROR: ‘ + err);
     } else {
       res.send(‘Success!’);
     }
   });
});

var bot = controller.spawn({
  token: process.env.BOT_TOKEN,
  incoming_webhook: {
    url: 'WE_WILL_GET_TO_THIS'
  }
}).startRTM();

controller.hears(‘hi’, ‘direct_message’, function(bot, message) {
 bot.reply(message,”Hello.”);
});
