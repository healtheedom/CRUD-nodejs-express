const express = require('express');
const router = express.Router();
const Post = require('../../modles/post')
const User = require('../../modles/user')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

router.get('/',(req,res)=>{
    req.session.bob = 'bob123'
    Post.find({}).then(posts=>{
        res.render('home',{posts: posts});
    })
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/logout', function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
  });

passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'No user found.' });
        }
        if (password !== user.password) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
    }
  ));

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
    })(req,res,next);
});

router.get('/register',(req,res)=>{
    res.render('register');
})

router.post('/register',(req,res)=>{
    
    if(req.body.reg_password !== req.body.reg_password_confirm){
        res.render('register');
    }else{
        User.findOne({username: req.body.reg_username}).then(user=>{
            if(!user){
                new User({
                    username: req.body.reg_username,
                    password: req.body.reg_password,
                    email: req.body.reg_email
            
                }).save().then(saved=>{
                    req.flash('success_message', 'Registered successfully, please login');
                    res.redirect('login');
                });
            }
            else{
                req.flash('error_message', 'Username exists');
                res.redirect('register');
            }
        })
        
    }
})

router.get('/post/:id',(req,res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        res.render('post', {post: post});
    })
})

router.get('/about/:name',(req,res)=>{
    res.render('about', {person: req.params.name});
})

module.exports = router;