const express = require('express');
const router = express.Router();
const Post = require('../../modles/post')
const multer = require('multer');
const moment = require('moment');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', userAuthenticated, (req,res,next)=>{
    next();
})

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  var upload = multer({ storage: storage })

router.get('/',(req,res)=>{
    Post.find({}).then(posts=>{
        res.render('admin/post/index',{posts: posts});
    })
    
})

router.get('/form',(req,res)=>{
    res.render('admin/post/form');
})

router.get('/edit/:id',(req,res)=>{
    Post.findOne({_id: req.params.id}).then(post=>{
        res.render('admin/post/edit', {post: post});
    })
    //res.render('admin/post/edit');
})

router.post('/edit',(req,res)=>{
    console.log(req.body.id);
    Post.findOne({_id: req.body.id}).then(post=>{
        post.title = req.body.title;
        post.body = req.body.body;
        post.save().then(saved=>{
            res.redirect('/admin/post');
        })
    });
    //res.render('admin/post/edit');
})
router.post('/form',(req, res)=>{
    let filename = ' ';
    if (typeof req.files.myFile == 'undefined') {
        // File does not exist.
        console.log('no files');
      } else {
        // File exists.
        
        console.log(req.files.myFile);
        let file = req.files.myFile;
        filename = Date.now() + '-' + file.name;
        file.mv('./public/uploads/' + filename);
      }
    
    new Post({
        title: req.body.title,
        body: req.body.body,
        file: filename
    }).save().then(saved=>{
        req.flash('success_message','Post is created')
        res.redirect('/admin/post');
    });
})

router.delete('/:id',(req,res)=>{
    Post.remove({_id: req.params.id}).then(removed=>{
        res.redirect('/admin/post');
    });
})

module.exports = router;