const crypto = require("crypto");
const request = require("request");
const {Routing} = require('./Routing.js');

//expand process.env with my local settings
require('dotenv').config();
const RoutingMap = {"abort" : true}; 

if( process.env.ROUTINGMAP ) 
     Object.assign(
         RoutingMap, 
          require('./_RoutingMap.json') ,
         { "abort" : false }
    ); 

const bufSecret = Buffer.from( process.env.SECRET_TT, 'base64');    

module.exports = function (context, req) {
  var auth = req.headers["authorization"];

  // HMAC security validation
  var msgBuf = Buffer.from(req.rawBody, "utf8");
  var msgHash ="HMAC " + crypto.createHmac("sha256", bufSecret).update(msgBuf).digest("base64");

  //if( RoutingMap.entries().length === 0){
    if( RoutingMap.abort){
    //TODO : return 404 resource not found
  } else 
  if (msgHash == auth ) {
    let userText = 'default';
    let forwardBody = JSON.parse(req.rawBody); 

    /*
    * extract Bot name and command text, etc
     */
    let [ botName, commandText, otherText  ] = forwardBody.text
    .match(/^(?:[<]at[>])(.+)(?:[<]\/at[>])\s?([^\s]+)\s?(.*?)(?:\\n)?$/i).slice(1);

    userText = commandText || userText; 
    context.log( forwardBody.userCommand, RoutingMap ); 
    const myRouting = new Routing( botName, RoutingMap )
    
    Object.assign(forwardBody, {
      userCommand : {
        userText: userText,
        botName : botName,
        otherText : otherText
      }
    });
    context.log( forwardBody.userCommand, myRouting.url ); 

    request.post(
      myRouting.url,
      {
        body: JSON.stringify(forwardBody),
        headers: { "content-type": "application/json" },
      },
      function (error, response, body) {
        context.res = {
          headers: { "content-type": "application/json" },
          body : JSON.stringify({
              type : "message" ,
              text : body
          })
        };
        context.done();
      }
    );
  } else {
    context.res = {
      status: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        type: "message",
        text: "Error: message sender cannot be authenticated.",
      }),
    };
    context.done();
  }
};
