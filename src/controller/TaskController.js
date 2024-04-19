const Task = require('../models/task');
const validator = require('validator');
const cache = require('../../cache');


exports.getAllTasks = async (req, res) => {
  try {
    let tasks = [];
    if (cache.has("tasks")) {
      tasks = cache.get("tasks");
    } else {
      tasks = await Task.find();
      cache.set('tasks', tasks);
    }
    res.render('home', { tasks });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.addTask = async (req, res) => {
  const { title, description } = req.body;
  if (validator.isEmpty(title) || validator.isEmpty(description)) {
    res.status(400).send(`Title OR Description cannot be null!`);
  }
  try {
    const task = new Task({ title, description });
    await task.save();
    cache.del('tasks');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await Task.findByIdAndDelete(id);
    cache.del('tasks');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.updateTask = async (req, res) => {
  const { id, title, description, completed } = req.body;
  try {
    if (validator.isEmpty(title.trim()) || validator.isEmpty(description.trim())) {
      res.status(400).send(`Title OR Description cannot be null!`);
    }
    const task = await Task.findById(id);
    task.title = title;
    task.description = description;
    task.completed = completed ? true : false;
    await task.save();
    cache.del('tasks');
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
