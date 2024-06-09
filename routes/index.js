var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const userModel = require("./users");
const CarModel = require("./Car");
const passport = require('passport');
const upload = require('./multer');
const localStrategy = require("passport-local");

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('i');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/service', function(req, res, next) {
  res.render('service');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});

router.get('/login', isLoggedIn, function(req, res, next) {
  res.render('index');
});

let Car = [];

router.get('/Car', (req, res) => {
  res.render('Car', { Car });  
});

router.post('/showcar', async(req, res) => {
  const { carName, carModelName, price, year, fuelType, type, carImages, run } = req.body;

  try {
    const newCar = new CarModel({ carName, carModelName, price, year, fuelType, type, carImages, run });
    await newCar.save();
    res.redirect('/showcar');
  } catch (err) {
    console.error('Error saving car data:', err);
    res.status(500).send('Error saving car data');
  }
});

router.get('/showcar', async (req, res) => {
  try {
    const cars = await CarModel.find();
    res.render('showcar', { Car: cars });
  } catch (err) {
    console.error('Error retrieving car data:', err);
    res.status(500).send('Error retrieving car data');
  }
});

router.post('/register', async function(req, res) {
  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).send('A user with the given username is already registered');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var data = new userModel({
      username: req.body.username,
      email: req.body.email,
      contact: req.body.contact,
      password: hashedPassword,
      role: req.body.role
    });

    userModel.register(data, req.body.password)
      .then(function(registeredUser) {
        passport.authenticate("local")(req, res, function() {
          res.redirect("/login");
        });
      })
      .catch(err => {
        console.error('Error during registration:', err);
        res.status(500).send('Error during registration');
      });
  } catch (err) {
    console.error('Error during registration:', err);
    res.status(500).send('Error during registration');
  }
});

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}), function(req, res) {
});

router.get('/logout', function(req, res , next) {
  req.logout(function(err){
    if(err) { return next(err); }
    res.redirect("/login");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

module.exports = router;
