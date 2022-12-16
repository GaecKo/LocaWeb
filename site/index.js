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
const { application } = require('express');

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

const upload = multer({
  dest: "./temp"
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
app.use("/uploads", express.static(__dirname + '/data/uploads'));

//add the router
app.use('/', router);
app.use(express.urlencoded());
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


// render the accueil.html page 
app.get('/', function (req, res) {
  res.render('./accueil', {username : req.session.username, customs: req.session.customs});
});

app.get('/login', function (req, res) {
  if (req.session.username) {
    res.redirect('/')
  } else {
    res.render('./login', {error: req.session.error, username : req.session.username, customs: req.session.customs});
    req.session.error = undefined;
  }
  
});

app.get('/signup', function (req, res) {
  if (req.session.username) {
    res.redirect('/')
  } else {
    req.session.error = undefined;
    res.render('./signup',{error: req.session.error, username : req.session.username, customs: req.session.customs});
  }
});

app.get('/profile', async function (req, res) {
  if (req.session.username) {
    const user = await db.getUser(req.session.username);
    const announces = await db.getUserAds(user.id);
    res.render('./profile', {username : req.session.username, user: user, announces: announces, screen_message: req.session.screen_message, customs: req.session.customs});
    req.session.screen_message = undefined;
  } else {
    res.redirect('/login')
  }
});

app.get('/announces', async function (req, res) {
  searching = false

  //check if the user is logged in
  if (req.session.username) {

    if (req.session.search != undefined) {
      announces = await db.searchAds(req.session.search);
      searching = true; // get the search results, indicates if the user is searching or not
      req.session.search = undefined;
    } else {
      announces = await db.getAllAds(); // if not searching
    }

    //for each ad get log the image array
    for (let i = 0; i < announces.length; i++) {let images = announces[i].images}
    
    moderator = undefined;
    user = undefined;
    if (req.session.username != undefined) {
      user = await db.getUser(req.session.username); //get the user object (logged in user)
      moderator = req.session.moderator // modo or not
    }
    res.render('./annonces', {searching: searching, user : user, error: req.session.screen_message, announces: announces, customs: req.session.customs});

  } else {
    res.redirect('/login')
  }
});

app.get('/announces/:productId', async function (req, res) {
  req.session.screen_message = undefined;
  req.session.error = undefined;
  const productId = req.params;
  const ad = await db.getAd(productId.productId);
  const author_username = await db.getUsername(ad.user)
  const user = await db.getUser(author_username) //get the user object (creator of the ad)
  const main_user = await db.getUser(req.session.username) // get the user object (logged in user)
  if (!ad.visibility) {
    req.session.screen_message = "This announce is currently being checked due to reports."
    res.redirect("/announces")
  }
  var imgArray = ad.images //get the images array
  const comments = await db.getFullComments(ad.comments)
  res.render("./annonce_main", {username : req.session.username, ad: ad, comments: comments, main_user: main_user, user: user, imgArray: imgArray, customs: req.session.customs});
});

app.get('/announces_builder', function (req, res) {
  //check if user is logged in
  if (req.session.username) {
    req.session.error = undefined;
    res.render('./announces_builder', {username : req.session.username, error: req.session.error, customs: req.session.customs});
  } else {
    res.redirect('/login')
  }
});

app.get('/announces_updater', async function (req, res) {
  //check if user is logged in
  if (req.session.username) {
    let ad = await db.getAd(req.session.adIdToUpdate)
    res.render('./announces_updater', {username : req.session.username, error: req.session.error, customs: req.session.customs, ad : ad});
  } else {
    res.redirect('/login')
  }
});

app.get('/logout', function (req, res) {
  req.session.destroy();
  res.redirect('/');
});

app.get('/admin', async function (req, res) {

  //Check if user is admin
  if (req.session.moderator == 1) {
    reports = await db.getFullReports()
    res.render('./moderateur', {username : req.session.username, reports: reports});
  } else {
    res.redirect('/')
  }
});


// POST REQUESTS

app.post('/announces', async function (req, res) {
  if (req.body.search != undefined) {
    req.session.search = req.body.search;
  }
  res.redirect('/announces')
});

app.post('/announces/:productId', async function (req, res) {
  let adId = req.params.productId;
  if (req.body.type == "comment") {
    let val = req.body.res_btn;
    let content = req.body.res_content;

    if (val == "") {
      await db.addComment(adId, content, req.session.userId) 

    } else {
      val = val.split("|")
      if (val[1] == '') {
        await db.addComment(adId, content, req.session.userId, parseInt(val[0])) // id_m|id_sub

      } else {
        await db.addComment(adId, content, req.session.userId, parseInt(val[0]), parseInt(val[1]))
      }
  }
 } else if (req.body.type == "coreport") {
    let content = req.body.rep_content
    let co_id = req.body.rep_btn
    await db.addCommentReport(co_id, content, req.session.userId)

  } else if (req.body.type == "adreport") {
    let content = req.body.rep_content
    await db.addAdReport(adId, content, req.session.userId)
  }
  
  res.redirect('/announces/' + adId)
});

app.post("/announces_updater",  upload.array("images" /* "images" is the name of the <file> input type in the form */), async (req, res) => {

  //delete the old images from the data/uploads folder
  let adId = req.session.adIdToUpdate
  let ad = await db.getAd(adId)
  let to_delete = ad.images
  for (let i = 0; i < to_delete.length; i++) {
    try {
      fs.unlinkSync(path.join(__dirname, "./data/uploads/"+to_delete[i]))
      console.log("successfully deleted :" +to_delete[i])
    }
    catch(err) {
      console.error(err)
    }
  }

  //the new images should be in the temp folder, we need to move them to the data/uploads folder
  //list with all the paths of the images
  let images = []

  for (let i = 0; i < req.files.length; i++) {
    const tempPath = req.files[i].path;
    const time = Date.now();
    const targetPath = path.join(__dirname, "./data/uploads/"+req.files[i].originalname+time+".png");

    if (path.extname(req.files[i].originalname).toLowerCase() === ".png") { //if the file is a png
      fs.rename
      ( tempPath, targetPath, async (err) => {
        if (err) return handleError(err, res);

          req.session.screen_message = "File uploaded succesfully!"
          await images.push(req.files[i].originalname+time+".png")
          console.log(req.files[i].originalname + " has been uploaded has "+req.files[i].originalname+time+ ".png ! ")

          // check if images ar all uploaded
          if (images.length == req.files.length) {

            //now that the images are uploaded, we can add the announce to the database
            title = req.body.title
            description = req.body.description
            price = req.body.price
            city = req.body.city
            rate = req.body.rate
            images = JSON.stringify(images) // list of all the images

            let result = await db.updateAdd(adId, title, description, city, price, rate, images)
            if (result) {
              req.session.screen_message = "Offer updated succesfully!"
              res
                .status(200)
                .contentType("text/plain")
                .redirect('/announces');
                
            } else {
              req.session.screen_message = "Something went wrong, please try again"
              res.redirect("/announces_builder")
            }
          }
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
  }
});

app.post('/getAd-for-Update', async function (req, res) {
  req.session.adIdToUpdate = req.body.adId;
  res.redirect('/announces_updater')
});

app.post('/login', async function (req, res) {

  let user = await db.getUser(req.body.username);

  if (!user) {
    req.session.error = "It seems like you don't have an account. Please create one."
    res.redirect('/signup')

  } else {
    let correctPassword = await bcrypt.compare(req.body.password, user.password)

    if (correctPassword) {
      console.log("User " + req.body.username + " logged in")
      req.session.username = req.body.username
      req.session.email = user.email
      req.session.moderator = user.moderator
      req.session.phone = user.phone
      req.session.sharing = user.sharing
      req.session.banned = user.banned
      req.session.userId = await db.getUserId(req.session.username)
      req.session.customs = await db.getCustoms(req.session.userId)
      res.redirect('/announces')

    } else {
      console.log("User " + req.body.username + " didn't give the proper password.")
      req.session.error = "The given password / username doesn't correspond. Please retry."
      res.redirect('/login')
    }
  }
  
});

app.post('/signup', async function (req, res) {
  phone = null
  sharing = true
  if (req.body.sharing == undefined) {
    sharing = false
  }
  if (req.body.phone != "") {
    phone = req.body.phone
  }

  let added_user = await db.addUser(req.body.username, req.body.email, bcrypt.hashSync(req.body.password, salt), phone, sharing)
  
  if (added_user) {
    req.session.username = req.body.username
    req.session.email = req.body.email
    req.session.userId = await db.getUserId(req.session.username)
    req.session.customs = await db.addCustoms(req.session.userId)
    res.redirect('/announces')
  } else {
    req.session.error = "It seems like you already have an account, please login"
    res.redirect("/login")
  }
});

app.post("/announces_builder",  upload.array("images" /* "images" is the name of the <file> input type in the form */), async (req, res) => {

  //the files should be in the temp folder, we need to move them to the data/uploads folder
  //list with all the paths of the images
  let images = []

  for (let i = 0; i < req.files.length; i++) {
    const tempPath = req.files[i].path;
    const time = Date.now();
    const targetPath = path.join(__dirname, "./data/uploads/"+req.files[i].originalname+time+".png");

    if (path.extname(req.files[i].originalname).toLowerCase() === ".png") { //if the file is a png
      fs.rename
      ( tempPath, targetPath, async (err) => {
        if (err) return handleError(err, res);

          req.session.screen_message = "File uploaded succesfully!"
          await images.push(req.files[i].originalname+time+".png")
          console.log(req.files[i].originalname + " has been uploaded has "+req.files[i].originalname+time+ ".png ! ")

          // check if images ar all uploaded
          if (images.length == req.files.length) {

            //now that the images are uploaded, we can add the announce to the database
            title = req.body.title
            description = req.body.description
            price = req.body.price
            city = req.body.city
            rate = req.body.rate
            images = JSON.stringify(images) // list of all the images

            let result = await db.addAd(req.session.userId, title, description, city, price, rate, images)
            if (result) {
              req.session.screen_message = "Offer added succesfully!"
              res
                .status(200)
                .contentType("text/plain")
                .redirect('/announces');
            } else {
              req.session.screen_message = "Something went wrong, please try again"
              res.redirect("/announces_builder")
            }
          }
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
  }
});

app.post("/admin", async function (req, res) {
  console.log("Type: " + req.body.type)
  console.log("Restore: " + req.body.res_btn)
  console.log("Delete: " + req.body.del_btn)
  if (req.body.type == "ad") {
    if (req.body.del_btn == undefined) {
      await db.clearAdReports(parseInt(req.body.res_btn))
    } else {
      let adId = parseInt(req.body.del_btn)
      let ad = await db.getAd(adId)
      let to_delete = ad.images
      for (let i = 0; i < to_delete.length; i++) {
        try {
          fs.unlinkSync(path.join(__dirname, "./data/uploads/"+to_delete[i]))
          console.log("successfully deleted :" + to_delete[i])
        }
        catch(err) {
          console.log("Error while trying to delete the file: " + to_delete[i])
          console.error(err)
        }
      }
      await db.deleteAd(parseInt(adId))
    }
  } else if (req.body.type == "co") {
    if (req.body.del_btn == undefined) {
      await db.clearCommentReports(parseInt(req.body.res_btn))
    } else {
      await db.disableComment(parseInt(req.body.del_btn))
    }
  }
  res.redirect("/admin")
});

app.post("/profile", async function (req, res) {

  if (req.body.change_password != undefined) {
    const password = req.body.new_password;

    //update the password
    const changepswd = await db.updatePassword(req.session.userId, bcrypt.hashSync(password, salt))
    if (changepswd) {
      req.session.screen_message = "Password changed succesfully!"
    } else {
      req.session.screen_message = "Something went wrong, please try again"
    }

  } else if (req.body.change_info != undefined) {
    req.session.screen_message = ""
    if (req.body.new_username != req.session.username) {
      changed_username = await db.updateUsername(req.session.userId, req.body.username)
      if (changed_username) {
        req.session.username = req.body.new_username
        req.session.screen_message += "\nUsername updated!"
      } else {
        req.session.screen_message += "\nThis username is already taken, please try another one"
      }
    }
    
    if (req.body.new_email != req.session.email) {
      changed_email = await db.updateEmail(req.session.userId, req.body.new_email)
      if (changed_email) {
        req.session.email = req.body.new_email
        req.session.screen_message += "\nEmail updated!"
      } else {
        req.session.screen_message += "\nThis email is already taken, please try another one"
      }
    }

    if (req.body.new_phone != req.session.phone) {
      changed_phone = await db.updatePhone(req.session.userId, req.body.new_phone)
      if (changed_phone) {
        req.session.phone = req.body.new_phone
      } else {
        req.session.screen_message += "\nThe new phone number couldn't be added. Please retry"
      }
    }
    if (req.body.sharing != "") {
      sharing = req.body.sharing == "enable"
      changed_sharing = await db.updateSharing(req.session.userId, sharing)
      if (changed_sharing) {
        req.session.sharing = req.body.sharing
      } else {
        req.session.screen_message += "\nThe new sharing state couldn't be updated. Please retry"
      }
    }

  } else if (req.body.change_customs != undefined) {
    tag_color = null
    bg_color = null
    if (req.body.tag_color != "") {
      tag_color = req.body.tag_color
      tag_color = await db.updateTagCustom(req.session.userId, tag_color)
    }
    if (req.body.light_mode != "") {
      light_mode = req.body.light_mode
      light_mode = await db.updateLightModeCustom(req.session.userId, light_mode)
    }
    
    if (tag_color || light_mode) {
      req.session.screen_message = "Color(s) changed succesfully!"
    }
    req.session.customs = await db.getCustoms(req.session.userId)
  }

  res.redirect("/profile")
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
