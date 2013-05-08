var http = require('http');
var express = require('express');
var exec = require('child_process').exec;
var tts_api = require('node-tts-api');
var xmpp = require('simple-xmpp'); // https://github.com/simple-xmpp/node-simple-xmpp

// Constants:
var xmpp_jid = 'raspipboy.client@gmail.com';
var xmpp_password = '<password here>';
var tts_drivers = {
  "espeak": "espeak",
  "google_translate": "google_translate",
  "tts_api": "tts_api"
};

// Conf:
var port = 9091;
var tts_driver = tts_drivers["google_translate"];
//var tts_driver = tts_drivers["espeak"];
console.log("Default TTS driver: " + tts_driver);


/**
 * Make the raspberry say a sentence.
 * Could use different text-to-speach implementations.
 *   - espeak: Need espeak CLI install, no internet, robot voices
 *   - google_translate: No libs but need internet connectivity, good voices
 *   - http://www.tts-api.com: No libs, need internet, EN only
 */
var say = function(sentence, tts_driver) {
  console.log('Saying with driver <' + tts_driver + '> sentence <' + sentence + '>');
  if (tts_driver == tts_drivers["espeak"]) {
    exec('espeak -v fr-fr -k20  "' + sentence + '"');
  }
  else if (tts_driver == tts_drivers["google_translate"]) {
    var google_tts_url = "http://translate.google.com/translate_tts?tl=fr&q=" + sentence;
    console.log(google_tts_url);
    exec('mplayer -ao alsa -volume 100 -noconsolecontrols  "' + google_tts_url + '"');
  }
  else if (tts_driver == tts_drivers["tts_api"]) {
    tts_api.getSpeech(sentence, function(error, tts_link) {
      console.log(tts_link);
      exec('mplayer -ao alsa -volume 100 -noconsolecontrols  "' + tts_link + '"');
    });
  }
  else {
    console.log('[#say] No defined driver for <' + tts_driver + '>');
  } 
};
    
    
/** 
 * DEPRECATED 
 * HTTP based version.
 */

 var app = express();

app.get('/say/:sentence', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello Bitch World\n');

  // Check for tts driver overrides:
  var overrided_tts_driver = tts_drivers[req.query.tts_driver];
  if (overrided_tts_driver) {
    tts_driver = overrided_tts_driver;
   console.log("Override TTS driver to: " + tts_driver);
  }

  if (req.params.sentence) {
    say(req.params.sentence, tts_driver);
  }
});

app.listen(port);
console.log('Server running on port:' + port);


/**
 * XMPP version.
 */

xmpp.on('online', function(){
  console.log(xmpp_jid + " is online.");
});

xmpp.on('error', function(e) {
  console.log(e);
});

xmpp.on('subscribe', function(from) {
  console.log("Subscribe from" + from);
});

xmpp.on('chat', function(from, msg) {
  console.log(from + ": " + msg);
  say(msg, tts_driver);
});

// Establish a connection
xmpp.connect({
    jid         : xmpp_jid,
    password    : xmpp_password,
    host        : 'talk.google.com',
    port        : 5222
});

/* Google app engine jabber jid */
xmpp.subscribe('grosbouddha@gmail.com');

/* Google app engine jabber jid */
xmpp.subscribe('raspipboy@appspot.com');