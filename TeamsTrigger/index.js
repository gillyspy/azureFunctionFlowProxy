const crypto = require("crypto");
const request = require("request");

//expand process.env with my local settings
require('dotenv').config();

const myCfg = {
    secret : process.env.SECRET_TT,
    flow : 'https://prod-01.westus.logic.azure.com:443/workflows/' 
    + 'd2d5faed674c431b8db4d179983874be/triggers/manual/paths/invoke?'
    + 'api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig='
    + process.env.FLOWSIG_TT
}

const bufSecret = Buffer(
    myCfg.secret,
    'base64'
);
const flowWebhook = myCfg.flow;

module.exports = function (context, req) {
  var auth = req.headers["authorization"];

  // HMAC security validation
  var msgBuf = Buffer.from(req.rawBody, "utf8");
  var msgHash ="HMAC " + crypto.createHmac("sha256", bufSecret).update(msgBuf).digest("base64");

  if (msgHash == auth ) {
    let userText = 'default';
    let forwardBody = JSON.parse(req.rawBody); 

    if (forwardBody.text){
        userText = forwardBody.text.match(/^([<]at[>])?Sf link([<]\/at[>])?\s?(.*?)(\\n)?$/im)[3];
        
    }

     context.log('userText',userText, myCfg.secret ); 
    Object.assign(forwardBody, {
      userText: userText,
    });

    request.post(
      flowWebhook,
      {
        body: JSON.stringify(forwardBody),
        headers: { "content-type": "application/json" },
      },
      function (error, response, body) {
        const rawBody = JSON.stringify({
          rawBody: req.rawBody,
          error: error || "",
        });

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
