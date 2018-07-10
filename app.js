// app.js
var express = require('express');
var app = express();
var db = require('./db');
var UserController = require('./user/UserController');
var SpotController = require('./spot/SpotController');
var cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');


app.use(cors());
app.use('/user', UserController);
app.use('/spot', SpotController);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.all('*', (req,res,next) => {
  res.status(404).send({"message":"This is crazy, but this page was not found"});
});

module.exports = app;
