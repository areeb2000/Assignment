const express = require('express');
const router = express.Router();
const jobRoleController = require('../controllers/jobRoleController');
const authMiddleware = require('../middleware/auth');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Job role routes
router.get('/', jobRoleController.getAll);
router.get('/:id', jobRoleController.getById);
router.post('/', jobRoleController.create);
router.put('/:id', jobRoleController.update);
router.delete('/:id', jobRoleController.delete);

module.exports = router;