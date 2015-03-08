var express = require('express'),
    xml2js  = require('xml2js').parseString,
    getRawBody = require('raw-body');

var app = express();

app.use(function (req, res, next) {
  getRawBody(req, {
    length: req.headers['content-length'],
  }, function (err, string) {
    if (err)
      return next(err)

    req.text = string;
    next()
  })
})

function postHandler(req, res, next){
  var contentType = req.headers['content-type'] || '',
      ip          = req.ip,
      method      = req.method,
      out         = {};

  out.method = method;
  out.ip     = ip;
  out.type   = contentType;

  prepareBody(req.text.toString('utf8'));

  console.log('Something happened', out);
};

function prepareBody(body) {
  return xml2js(body, function(err, result) {
   /**
    * Monit sends something like this at 'result';
    * { monit:
    *    { '$':
    *       { id: '7cbd97795c5cb2fc88be411a9b5034e4',
    *         incarnation: '1425789152',
    *         version: '5.6' },
    *      server: [ [Object] ],
    *      platform: [ [Object] ],
    *      services: [ [Object] ],
    *      servicegroups: [ [Object] ],
    *      event: [ [Object] ] } }
    **/
    var prep = JSON.stringify(result.monit, null, 4);
    //prep.hostname = result.monit.server[0].localhostname;

    console.log(prep);

  });
}

app.post('/', postHandler);

app.listen(8080);
