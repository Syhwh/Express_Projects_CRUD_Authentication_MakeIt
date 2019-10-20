const { Router } = require('express');
const router = Router();

//import the model
const Project = require('../database/models/projectSchema');

//
const countDocuments = async (user) => {
  const projects = await Project.find({ user });
  const total = await Project.countDocuments({ user });
  const notStarted = await Project.countDocuments({ user, status: 'Not Started' });
  const inProgress = await Project.countDocuments({ user, status: 'In progress' });
  const done = await Project.countDocuments({ user, status: 'Done' });

  const countProjects = {
    total,
    notStarted,
    inProgress,
    done
  };
  const response = {
    projects,
    countProjects,
  };
  return response
}


// required user middleware
const requireUser = (req, res, next) => {
  if (!res.locals.user) {
    return res.status(401).send('user Not found');
  }
  next();
}

/// Routes
router.get('/', (req, res) => {
  res.sendFile('index');
});

router.get('/projects', requireUser, async (req, res, next) => {
  try {
    const response = await countDocuments(res.locals.user);
    console.log('response in get' + response)
    res.status(200).json(response);
  } catch (error) {
    return next(error)
  }
});

router.post('/projects/add', requireUser, async (req, res, next) => {
  const data = {
    title: req.body.projectTitle,
    description: req.body.projectDescription,
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

router.delete('/projects/delete/:id', requireUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    await Project.deleteOne({ _id: id });
    res.status(200).json({ message: 'Projec deleted' });
  } catch (error) {
    return next(error)
  }
});

router.get('/projects/edit/:id', requireUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    const project = await Project.findById({ _id: id });
    res.status(200).json(project);
  } catch (error) {
    return next(error)
  }
});
router.patch('/projects/edit/:id', requireUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('server id' + id)
    await Project.updateOne({ _id: id }, { title: req.body.projectTitle, description: req.body.projectDescription });
    res.status(200).json({ message: 'Project edited succesfully' });
  } catch (error) {
    return next(error)
  }
});


router.patch('/projects/edit/status/:id', requireUser, async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('server id' + id)
    await Project.updateOne({ _id: id }, { status: req.body.status });
    const response = await countDocuments(res.locals.user);
    res.status(200).json({ response, message: 'Status updated succesfully' });
  } catch (error) {
    return next(error)
  }
});


module.exports = router;