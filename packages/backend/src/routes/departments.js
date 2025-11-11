const express = require('express');
const departmentController = require('../controllers/departmentController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All department routes require authentication
router.use(authenticateToken);

// Routes
router.get('/', departmentController.getAll);
router.get('/:id', departmentController.getById);
router.get('/:id/stats', departmentController.getStats);
router.post('/', departmentController.create);
router.put('/:id', departmentController.update);
router.delete('/:id', departmentController.delete);

module.exports = router;