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
const multer = require("multer");

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./temp"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});

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
  req.session.error = undefined;
  res.render('./accueil', {username : req.session.username});
});

app.get('/login', function (req, res) {
  res.render('./login', {error: req.session.error});
});

app.get('/signup', function (req, res) {
  res.render('./signup');
});

app.get('/announces', function (req, res) {
  //req.session.error = undefined;
  res.render('./annonces', {username : req.session.username, error: req.session.error});
});

app.get('/announces/:id'), function (req, res) {
  console.log(id)
  res.render("./acceuil")
}

app.get('/announces_builder', function (req, res) {
  req.session.error = undefined;
  res.render('./announces_builder', {username : req.session.username, error: req.session.error});
});

app.post('/login', async function (req, res) {

  let user = await db.getUser(req.body.username);

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
    req.session.username = req.body.username
    req.session.email = req.body.email
    res.redirect('/announces')
  } else {
    req.session.error = "It seems like you already have an account, please login"
    res.redirect("/login")
  }
});

app.post("/announces_builder",  upload.single("images" /* "images" is the name of the <file> input type in the form */),(req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, "./uploads/"+req.file.originalname);

  if (path.extname(req.file.originalname).toLowerCase() === ".png") { // we can add more file types
    fs.rename(tempPath, targetPath, err => {
      if (err) return handleError(err, res);

      req.session.error = "File uploaded succesfully!"

      console.log(req.file.originalname + " has been uploaded !")

      //now that the image is uploaded, we can add the announce to the database
      title = req.body.title
      description = req.body.description
      price = req.body.price
      city = req.body.city
      image = req.file.originalname //we store the name of the image in the database

      db.addAd(req.session.username, title, description, city, price, image).then((result) => {
        if(result){
          console.log("Ad added to the database")
          req.session.error = "Offer added succesfully!"
          res
            .status(200)
            .contentType("text/plain")
            .redirect('/announces');
           
        } else {
          req.session.error = "Something went wrong, please try again"
          res.redirect("/announces_builder")
        }
        }).catch((err) => {
        console.log(err)
       })
    });
    

  } else { //if the file is not a png
    fs.unlink(tempPath, err => {
      if (err) return handleError(err, res);

      res
        .status(403)
        .contentType("text/plain")
        .end("Only .png files are allowed!");
    });
  }
});


app.get("/image.png", (req, res) => {
  res.sendFile(path.join(__dirname, "./uploads/image.png"));
});


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
