const { Router } = require('express');
const router = Router();
//import the model
const Project = require('../database/models/projectsSchema');

router.get('/info', async (req, res, next) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        return next(error)
    }
});

router.get('/',(req,res)=>{
    res.sendFile('index')
})

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

module.exports = router;