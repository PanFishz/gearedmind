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

const catchAsync = require('./utils/catchAsync.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const ruleRoutes = require('./routes/rules.js');
const gameRoutes = require('./routes/games.js');
const userRoutes = require('./routes/users.js')

const gearedmind = require('./controllers/gearedmind.js')

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// mongo atlas dbbase, if not provided, use local
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/Gearedmind'
mongoose.connect(dbUrl)

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
    // console.log(req.session.returnTo)

    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    // console.log(res.locals.currentUser)
    // console.log(req.session.returnTo)
    next();
})


app.use('/games', gameRoutes);
app.use('/rules', ruleRoutes);
app.use('/users', userRoutes);

app.get("/", catchAsync(gearedmind.index));

app.all('*', gearedmind.pageNotFound)

app.use(gearedmind.error)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})