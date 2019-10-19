
if (process.env.NODE_ENV == 'testing') {
    require('custom-env').env('testing');
} else{
    require('dotenv').config();
}

const express = require('express');
const morgan = require('morgan');
const cookieSession = require('cookie-session');

//Config files
const config = require('./config/config');

//Model
const User = require('./database/models/userSchema');

//Routes
const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes');

// application
const app = express();

//Database
require('./database/database');

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieSession(config.cookieSession));

app.use(async (req, res, next) => {
    const userId = req.session.userId;
    if (userId) {
        const user = await User.findById(userId);
        if (user) {
            res.locals.user = user;
        } else {
            delete req.session.userId;
        }
    }
    next();
});

//static files
app.use(express.static(config.static));
//routes
app.use(routes);
app.use(authRoutes);
app.use(morgan('dev'));

// Handle errors
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({ error: err.message });
});

module.exports = app;