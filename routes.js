
var cors = require('cors');
var departure = require('./server/components/departure');

module.exports = function(router) {

  // Insert routes below
  router.get('/', function (req, res) {
    res.render('pages/index.ejs');
  });

  router.get('/infos', function (req, res) {
    res.render('pages/infos.ejs');
  });

  router.get('/impressum', function (req, res) {
    res.render('pages/impressum.ejs');
  });

  router.get('/demo', function (req, res) {
    res.render('pages/demo.ejs');
  });

  // Cache Manifest
  router.get('/cache.manifest', function (req, res) {
    res.header("Content-Type", "text/cache-manifest");
    res.send('CACHE MANIFEST\n# v10\nCACHE:\n/style.css\n/196x196.png\n/appstore.svg\n/email.png\n/facebook.png\n/icon.png\n/icon.svg\n/icon114.png\n/icon120.png\n/icon144.png\n/icon152.png\n/icon57.png\n/icon72.png\n/icon76.png\n/icon_smaller.png\n/twitter.png\nhttp://fonts.googleapis.com/css?family=Open+Sans:700,300\nhttp://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js\nhttp://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/jquery.mobile.min.css\nhttp://ajax.googleapis.com/ajax/libs/jquerymobile/1.4.3/jquery.mobile.min.js\n/infos\n/demo\n/impressum\n/\n NETWORK:\n*\n');
  });

  router.get('/departure-time/location/:long/:lat', cors(), function (req, res) {
    departure.getTimetables(req.params.long, req.params.lat)
      .then(function(result) {
        res.json(result);
        res.end();
      })
      .fail(function(err) {
        res.status(500).json({error: "coudn't get departure times"});
        res.end();
      });
  });
};
