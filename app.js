if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}


const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const user = require('./routes/users');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
//const dbURL = process.env.DB_URL
const dbUrl = 'mongodb://localhost:27017/yelp-camp'
const MongoStore = require('connect-mongo');

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology : true,
})


const db = mongoose.connection;
db.on('error' , console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("database connected");
})


app.set('view engine' , 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public' )))
app.engine('ejs', ejsMate);
app.use(mongoSanitize());

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: "thisshouldbeabettersecret",
    touchAfter: 24 * 60 * 60,
})

store.on("error" , function(e) {
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    name:'yelcamp',
    secret: 'thisshouldbeabettersecret!',
    resave:false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        //secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());


const scriptSrcUrls = [
    
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.titles.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
]
const styleSrcUrls = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css",
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.titles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];


const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: [],
        connectSrc: ["'self'" , ...connectSrcUrls],
        styleSrc: [ "'self'","'unsafe-inline'", ...styleSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        workerSrc:[ "'self'",  "blob:"],
        objectSrc: [],
        imgSrc:[
            "'self'",
            "blob:",
            "data:",
            "https://res.cloudinary.com/",
        ],
        fontSrc : ["'self'", ...fontSrcUrls],
      },
    })
  );

app.use(passport.initialize());
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser())

app.use((req,res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);
app.use('/', user);

app.get('/' , (req,res) => {
    res.render('home')
})



app.all('*' , (req,res, next) => {
    next(new ExpressError('Page not found' , 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!!"
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving on port 3000")
})