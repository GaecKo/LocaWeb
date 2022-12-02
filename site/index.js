const express = require('express');
const session = require('express-session')
const app = express();
const path = require('path');
const https = require('https');
const fs = require('fs');

const router = express.Router();
const PORT = 4000;
const db = require("./database.js");
const bodyParser = require("body-parser");
const bcrypt = require('bcryptjs');
const { type } = require('os');
var salt = bcrypt.genSaltSync(10);

app.set('views', __dirname + '/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: "APPR_PF08",
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


// render the accueil.html page 
app.get('/', function (req, res) {
  res.render('./accueil', {username : req.session.username});
});

app.get('/login', function (req, res) {
  res.render('./login', {error: req.session.error});
});

app.get('/signup', function (req, res) {
  res.render('./signup');
});

app.get('/announces', function (req, res) {
  req.session.error = undefined;
  res.render('./annonces', {username : req.session.username});
});

app.get('/announces/:id'), function (req, res) {
  console.log(id)
  res.render("./acceuil")
}

app.get('/announce_builder', function (req, res) {
  res.render('./annonce_builder', {username : req.session.username});
});

app.post('/login', async function (req, res) {

  let user = await db.getUser(req.body.username)
  console.log(req.body.password)
  console.log(user.password)

  if (!user) {
    req.session.error = "It seems like you don't have an account. Please create one."
    res.redirect('/login')

  } else {
    let correctPassword = await bcrypt.compare(req.body.password, user.password)

    if (correctPassword) {
      console.log("User " + req.body.username + " logged in")
      req.session.username = req.body.username
      req.session.email = user.email
      req.session.moderator = user.moderator
      res.redirect('/announces')

    } else {
      console.log("User " + req.body.username + " didn't give the proper password.")
      req.session.error = "The given password / username doesn't correspond. Please retry."
      res.redirect('/login')
    }
  }
});

app.post('/signup', async function (req, res) {
  let added_user = await db.addUser(req.body.username, req.body.email, bcrypt.hashSync(req.body.password, salt))
  if (added_user) {
    console.log("User " + req.body.username + " created")
    req.session.username = req.body.username
    req.session.email = req.body.email
    res.redirect('/announces')
  } else {
    req.session.error = "It seems like you already have an account, please login"
    res.redirect("/login")
  }
});

app.post('signup')
//The 404 Route
app.get('*', function(req, res){
  res.render('./error');
});


https.createServer({
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
  passphrase: 'APPR_PF08'

}, app).listen(PORT, function (err) {
  if (err) console.log(err);
  console.log('Running at https://localhost:' + PORT + '/');
});
