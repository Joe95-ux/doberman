//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const _ = require("lodash");
const sendMail = require("./mail");
const fs = require("fs");
const { S3Client, AbortMultipartUploadCommand } = require("@aws-sdk/client-s3");
const multerS3 = require("multer-s3");
const multer = require("multer");
const path = require("path");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
// const pups = require(__dirname + "/data.js");
const { getMaxListeners } = require("process");
const Pup = require("./models/pups");
const { ensureAuth, ensureGuest, ensureToken } = require("./middleware/auth");

const userSchema = require("./models/userSchema");
// const pupData = require("./puppyData.json");
const app = express();

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

connectDB();

// define storage for images

const s3 = new S3Client({
  region: process.env.S3_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
  }
});
//upload parameters for multer
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "doberman-uploads",
    metadata: function(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function(req, file, callback) {
      callback(null, Date.now() + file.originalname);
    }
  })
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      mongoOptions: { useUnifiedTopology: true }
    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.set("useCreateIndex", true);

userSchema.plugin(passportLocalMongoose);

const User = require("./models/user");

//passport local configurations.
passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

// async function getPups() {
//     try {
//         let response = await pups.getPuppies();
//         return response;
//     } catch (err) {
//         console.log(err);
//     }
// }

app.get("/", async (req, res) => {
  try {
    const puppies = await Pup.find({});
    res.render("home", {
      allPuppies: puppies
    });
  } catch (e) {
    console.log(e);
  }
});

app.post("/uploads", upload.single("photo"), ensureAuth, async (req, res) => {
  let post;
  try {
    req.body.user = req.user.id;
    post = req.body;
    if (req.file) {
      post.photo = req.file.location;
    }
    await Pup.create(post);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/puppies/:id", async (req, res) => {
  const requestedPuppy = req.params.id;
  const pups = await Pup.find({});
  let availPups = pups.filter(pup => pup._id != requestedPuppy);
  availPups = availPups.slice(0, 4);
  let puppy = await Pup.findOne({ _id: requestedPuppy });
  if (puppy) {
    res.render("puppy", { puppy: puppy, puppies: availPups });
  } else {
    res.redirect("/");
  }
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.get("/admin", ensureGuest, function(req, res) {
  res.render("admin");
});

app.get("/register", ensureGuest, function(req, res) {
  res.render("register");
});

app.get("/login", ensureGuest, function(req, res) {
  res.render("login");
});

app.get("/logout", function(req, res, next) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

app.get("/uploads", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("uploads");
  } else {
    res.redirect("/login");
  }
});

app.get("/contact", function(req, res) {
  res.render("contact");
});

app.get("/privacy", function(req, res) {
  res.render("privacy", {
    listTitle: "Privacy Policy"
  });
});

app.get("/shipping", function(req, res) {
  res.render("shipping", {
    listTitle: "Shipping"
  });
});

app.post("/register", ensureToken, function(req, res) {
  User.register({ username: req.body.username }, req.body.password, function(
    err,
    user
  ) {
    if (err) {
      console.log(err);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/uploads");
      });
    }
  });
});

app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    passsword: req.body.password
  });
  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/uploads");
      });
    }
  });
});

app.post("/email", async function(req, res, next) {
  //send email here.
  const { email, fname, lname, phone, state, text } = req.body;
  const subject = "Enquiry on puppy";
  try {
    await sendMail(email, fname, lname, phone, state, text);
    res.send("Message sent successfully") 
  } catch (error) {
    res.send("Message could not be sent");
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 9000;
}
app.listen(port, function() {
  console.log("Server has started sucessfully");
});
