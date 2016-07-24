var path = require('path');
var express = require('express');
var webpack = require('webpack');
var bodyParser = require('body-parser');
var config = require('./webpack.config');

var app = express();
var compiler = webpack(config);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

// app.use('/vendors',  express.static(__dirname + '/vendors'));
// app.use('/hj-mark',  express.static(__dirname + '/hj-mark'));
// app.use('/hj-uploader',  express.static(__dirname + '/hj-uploader'));

app.get(/^(?!\/api\/)/, function (req, res) {
  res.sendFile(path.join(__dirname, 'src/index.html'));
});

var apiCategory = require('./api/category');
app.use('/api', apiCategory);
var apiCommon = require('./api/common');
app.use('/api', apiCommon);
var apiMetadata = require('./api/metadata');
app.use('/api', apiMetadata);
var apiRes = require('./api/res');
app.use('/api', apiRes);
var apiUser = require('./api/user');
app.use('/api', apiUser);

var port = process.env.PORT || 5003;

app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:' + port);
});
