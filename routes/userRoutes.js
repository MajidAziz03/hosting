const express = require('express')
const router = express.Router()
const User = require('../models/user')
const flash = require('connect-flash')
const passport = require('passport')



router.get('/', (req,res)=> {
    res.render('home')
})



router.get('/register', (req,res)=>{
    res.render('register')
})

router.post('/register', async(req,res)=> {
    try{
const {username,email,number,password,cpassword} = req.body;
const user = new User({username,email,number})
const registeredUser = await User.register(user,password)
req.flash('success', "Successfully Registered")
res.redirect('/register')
    }
    catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }
})


router.get('/login',(req,res)=> {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {failureFlash : true, falseLogin: '/login'}), (req,res) => {
req.flash('success', " Welcome!")
res.redirect('/')
})

router.get('/logout', async(req,res,next)=> {
    req.logout((err)=> {
        if(err){
            return next(err)
        }
    })
    req.flash('success', 'Successfully Logout!')
    res.redirect('/')
})

module.exports = router;
