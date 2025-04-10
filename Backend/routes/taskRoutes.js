const express = require('express');
const { createTask, getUserTasks, updateTask, deleteTask, getAllTasks,completeTask } = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createTask);
router.get('/', protect, getUserTasks);
router.put('/:id', protect, updateTask);
router.delete('/:id', protect, deleteTask);
router.get('/admin', protect, admin, getAllTasks);
router.patch('/:id/complete', protect, completeTask);

module.exports = router;
