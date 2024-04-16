const express = require('express');

const taskController = require('../controller/TaskController');

const router = express.Router();

router.get("/", taskController.getAllTasks);
router.post("/add", taskController.addTask);
router.post('/delete/:id', taskController.deleteTask);
router.post('/update', taskController.updateTask);

module.exports = router;