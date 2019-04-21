require('dotenv').config();
var configAuth = require('./auth')
var express = require("express");
var passport = require('passport');
var mongoose = require('mongoose')
var FacebookStrategy = require('passport-facebook').Strategy;
mongoose.connect("mongodb://localhost:27017/OAuth", { useNewUrlParser: true });
var app = express();
var User = require('./app/models/user')

app.use(passport.initialize());
app.use(passport.session());

// passport.serializeUser(function(user, done) {
//     done(null, user);
//   });
  
//   passport.deserializeUser(function(user, done) {
//     done(null, user);
//   });

app.get('/', (req, res)=>{
    res.render("main.ejs");
})

app.get('/login',isLoggedIn, (req, res)=>{
    res.render("login.ejs");
})

app.get('/auth/facebook', passport.authenticate('facebook', {scope: ['email']}));

app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { 
    successRedirect: '/login',
    failureRedirect: '/', 
    session: false
}));
passport.use(new FacebookStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET,
    callbackURL: "https://12309985.ngrok.io/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done){
        process.nextTick(()=>{
                User.findOne({'facebook.id': profile.id}, (err, user)=>{
                console.log(err, user);
                if(err)
                    return done(err);
                if(user)
                    return done(null, user);
                else{
                    var newUser = new User();
                    newUser.facebook.id = profile.id,
                    newUser.facebook.token = accessToken,
                    newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName,
                    //newUser.facebook.email = profile.emails[0].value                    
                    newUser.save((err, doc)=>{
                        if(err)
                            throw err;
                        console.log(doc);
                        return done(null, newUser)
                        // res.send(null, newUser)
                    })
                }
            })
        })
    }
))
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
}
app.listen(3000, ()=>{
    console.log("Server has started");
})
