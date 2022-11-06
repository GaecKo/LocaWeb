const express = require('express');
const session = require('express-session')
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');

const router = express.Router();
const PORT = 4000;
let db = require("./database.js");
let Promise = require('promise');
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const { type } = require('os');
var salt = bcrypt.genSaltSync(10);

app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "appr_pf08",
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 3600000
  }
}));

// Static Files
app.use(express.static('public'));
app.use("/css", express.static(path.join(__dirname + '/public/css')));
app.use("/js", express.static(__dirname + '/public/js'));
app.use("/images", express.static(__dirname + '/public/images'));
app.use("/fonts", express.static(__dirname + '/public/fonts'));

//add the router
app.use('/', router);
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);