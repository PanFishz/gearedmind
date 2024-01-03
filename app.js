// if in development, get environment variables from .env
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
    //console.log(process.env.CLOUDINARY_CLOUD_NAME);    //to check
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require('method-override');

//middleware that catch Async 
const catchAsync = require('./utils/catchAsync.js');

//seesion cookie
const session = require('express-session');

const MongoStore = require('connect-mongo');

//flash messages like "sucessfully logged in"
const flash = require('connect-flash');
//password auth setup
const passport = require('passport');
const LocalStrategy = require('passport-local');

//model(blueprint)
const User = require('./models/user');


//"Routes" to forward the supported requests (and any information encoded in request URLs) to the appropriate controller functions. 
//Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.
//routes are used to break up all routes
const ruleRoutes = require('./routes/rules.js');
const gameRoutes = require('./routes/games.js');
const userRoutes = require('./routes/users.js')

//controllers store the logic
const gearedmind = require('./controllers/gearedmind.js')

//set up templates
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//tell express to go to public to get static files such as images(logos)
app.use(express.static(path.join(__dirname, 'public')))

//express.urlencoded() is required when you are submitting a form with post method and you need to acess that form data using req.body 
app.use(express.urlencoded({ extended: true }))

// to use method other than "get" and "post"
app.use(methodOverride('_method'))

// mongo atlas dbbase, if not provided, use local
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Gearedmind'

//for development from not-whitelisted Api, use local 
//const dbUrl = 'mongodb://localhost:27017/Gearedmind'
mongoose.connect(dbUrl)

//database
const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB connection error"));
db.once("open", () => { console.log("Database connected"); });

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: secret
    }
});

store.on('error', function (e) {
    console.log("session store error", e)
})

const sessionConfig = {
    store, //same as 'store:store,'
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
//flash() must precede routes, bc flash() gives req.flash() function
app.use(session(sessionConfig))
app.use(flash());

//Middlewares orders is important. Put the .use(passport...) before the .use(router...)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
    //console.log(req.session.returnTo)

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // console.log(res.locals.currentUser)
    // console.log(req.session.returnTo)
    next();
})

//divided into 3 main paths and index homepage
app.use('/games', gameRoutes);
app.use('/rules', ruleRoutes);
app.use('/users', userRoutes);

//index homepage
app.get("/", catchAsync(gearedmind.index));

//everything else throw pageNotFound
app.all('*', gearedmind.pageNotFound)

app.use(gearedmind.error)


//define port and listen to it
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}..`)
})