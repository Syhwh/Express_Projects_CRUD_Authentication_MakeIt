const { Router } = require('express');
const router = Router();
//const cookieSession=require('cookie-session');


//import the model
const Project = require('../database/models/projectSchema');

// required user middleware
const requireUser = (req, res, next) => {
    if (!res.locals.user) {
        return res.status(401).send('user Not found');
    }
    next();
}

/// Routes
router.get('/',  (req, res) => {
    res.sendFile('index');
});

router.get('/projects',requireUser ,async (req, res, next) => {
    try {
        const projects = await Project.find({ user: res.locals.user});
        res.status(200).json(projects);
    } catch (error) {
        return next(error)
    }
});

router.post('/projects/add',requireUser ,async (req, res, next) => {
    const data = {
        title: req.body.projectTitle,
        description: req.body.projectDescription,
        date: Date.now(),
        user: res.locals.user
    }
    try {
        const project = new Project(data);
        await project.save();
        res.status(200).json(project);
    } catch (err) {
        if (err.name === "ValidationError") {
            res.status(422).json({ errors: err.errors });
          } else {
            next(err);
          }
    }
});

router.get('/projects/delete/:id', requireUser,async (req, res, next) => {
    try {
        const { id } = req.params;
        await Project.deleteOne({ _id: id });
        res.sendStatus(200);
    } catch (error) {
        return next(error)
    }
});

router.get('/projects/edit/:id',requireUser, async (req, res, next) => {
    res.render('../edit')
   
   
    // try {
    //     const { id } = req.params;
    //     await Project.deleteOne({ _id: id });
    //     res.redirect("/");
    // } catch (error) {
    //     return next(error)
    // }
});


module.exports = router;