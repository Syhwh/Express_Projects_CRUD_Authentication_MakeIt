const { Router } = require('express');
const router = Router();
//import the model
const Project = require('../database/models/projectsSchema');

router.get('/',async (req, res) => {
    const projects= await Project.find();
    res.sendFile('index').json({projects})

});

router.post('/projects', async (req, res, next) => {
    const data = {
        title: req.body.projectTitle,
        description: req.body.projectDescription,
        date: Date.now()
    }
    try {
        const project = new Project(data);
        await project.save();
    } catch (error) {
        return next(error)
    }
    res.redirect("/");
});

module.exports=router;