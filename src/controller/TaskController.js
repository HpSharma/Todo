const Task = require('../models/task');
const validator = require('validator');


exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
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
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
