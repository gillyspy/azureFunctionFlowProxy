const {RegExCustom : myRegex} = require( './RegExCustom.js')

/*
expects a body like this example
{
    "method": "test",
    "pattern" : "aslfasdadf", 
    "flags" : "",
    "string" : "a sentence or whatever",
    "replace" : "$1"
}

pattern & flags get converted with new RegExp(pattern,flags);

*/
module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function RegExJS processing.. a request.');

    //constructor(str = '', method = 'test', pattern = '^$', flags = 'gim', replace = '$1'){
    const escapedPattern = req.body.pattern.replace( /\\/, '\\\\' );
    context.log(JSON.stringify({
        "pattern" : req.body.pattern,
        "escapedPattern" :  escapedPattern
    }));

    let result = [];
    let strings; 
    strings =  Array.isArray(req.body.string) ? req.body.string : [req.body.string];
    strings.forEach(s=>{
        result.push(
            new myRegex( 
                s, 
                req.body.method,
                req.body.pattern,
                req.body.flags,
                req.body.replace
            )
        );
    });

    context.res = {
        headers : { "content-type" : "application/json" },
        // status: 200, /* Defaults to 200 */
        body: result
    };
}