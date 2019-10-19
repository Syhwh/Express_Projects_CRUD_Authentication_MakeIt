const { Router } = require('express');
const userRouter = Router();
//import the model
const User = require('../database/models/userSchema');

userRouter.post('/users/register', async (req, res, next) => {
    const userData = {
        name: req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPassword,
    }
    try {
        const user = await User.create(userData)
        res.status(200).json({ message: 'User created' });
    } catch (err) {
        if (err.name === "ValidationError") {
            res.status(422).json({ errors: err.errors });
        } else {
            next(err);
        }
    }
});


userRouter.post('/users/login', async (req, res, next) => {
    try {
        const user = await User.authenticate(req.body.email, req.body.password);
        if (user) {
            req.session.userId = user._id;
            res.status(200).send({ message: 'user logged' });
        } else {
            res.status(401).send({ error: 'Wrong email or password. Try again!' });
        }
    } catch (err) {
        if (err.name === "ValidationError") {
            res.status(422).json({ errors: err.errors });
        } else {
            next(err);
        }
    }
});

userRouter.post('/users/logout', async (req, res, next) => {
    try {
        req.session.userId = null;
        res.status(200).send({ message: 'user logged out' });
    } catch (err) {
        next(err)
    }
})

module.exports = userRouter;