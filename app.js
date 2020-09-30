const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const home = require('./routes/home/main');
const admin = require('./routes/admin/main');
const post = require('./routes/admin/post');
const methodOverride = require('method-override');
const multer = require('multer');
var busboyBodyParser = require('busboy-body-parser');
var bodyParser = require('body-parser');
const upload = require('express-fileupload');
const flash = require('connect-flash');
const session = require('express-session');
const {mongo} = require('./config/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

app.use(session({
    secret: 'rootme',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(upload());
app.use(busboyBodyParser());
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(passport.initialize());
app.use(passport.session());

app.use((req,res,next)=>{
    res.locals.user = req.user || null;
    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();
})

mongoose.connect('mongodb://localhost:27017/cms').then(data=>{
    console.log("connected to mongodb");
})
app.use('/', home);
app.use('/admin', admin);
app.use('/admin/post', post);
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine', 'ejs');





app.listen(9000, ()=>{
    console.log("listening");
});
