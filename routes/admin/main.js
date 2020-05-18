const express = require('express');
const router = express.Router();
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*', userAuthenticated, (req,res,next)=>{
    next();
})

router.get('/',(req,res)=>{
    res.render('admin/index');
})

module.exports = router;