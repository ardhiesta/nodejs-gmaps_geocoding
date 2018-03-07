var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var googleMapsClient = require('@google/maps').createClient({
  key: '[API_KEY]'
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

function geocodeAddress(alamat, res){
  // Geocode an address.
  googleMapsClient.geocode({
    address: alamat
  }, function(err, response) {
    if (!err) {
      console.log(response.json.results[0].geometry.location.lat);
      console.log(response.json.results[0].geometry.location.lng);
      //var obj = JSON.parse(response.json.results);
      //console.log(obj);
      var latitude = response.json.results[0].geometry.location.lat;
      var longitude = response.json.results[0].geometry.location.lng;
      // res.render('index', { title: 'Address Locator', lat: 'latitude: '+latitude, lng: 'longitude: '+longitude, hasil: 'Koordinat '+alamat+' : ' });
      res.render('index', { title: 'Address Locator', hasil: 'Koordinat ' + alamat + ' : ', location_info: 'latitude: ' + latitude + ' \nlongitude: ' + longitude });
    } else {
      console.log(err);
      res.render('index', { title: 'Address Locator', hasil: 'Koordinat ' + err });
    }
  });
}

app.post('/geo', function (req, res) {
  console.log(req.body.alamat);
  var alamat = req.body.alamat;
  geocodeAddress(alamat, res);
  // res.send(alamat);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
