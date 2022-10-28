const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const User = require('./models/user')
const ejsMate = require('ejs-mate')
const userRoutes = require('./routes/userRoutes')
const appError = require('./appError')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const localStrategy = require('passport-local')

mongoose.connect('mongodb://localhost:27017/medical', {useNewUrlParser:true, useUnifiedTopology:true})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "Connection Error : "))
db.once("Open", ()=> {
    console.log(" Database is Connected ")
})


app.set( 'view engine','ejs')
app.set('views', 'views')
app.engine('ejs', ejsMate)



const sessionConfig = {
    secret : "thereisnosecret",
    resave : false,
    saveUninitialized : true,
    httpOnly : true
}
app.use(session(sessionConfig))
app.use(flash())






app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())



app.use((req,res,next)=> {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use(express.urlencoded({extended:true}))
app.use('/', userRoutes)


const port = process.env.PORT || 3000
app.listen(port, ()=> {
    console.log(`Listening port at ${port}`)
})

