// app.js
var express = require('express');
var app = express();
var db = require('./db');
var UserController = require('./user/UserController');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');



app.use('/user', UserController);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.all('*', (req,res,next) => {
  res.status(404).send({"message":"This is crazy, but this page was not found"});
});

module.exports = app;
