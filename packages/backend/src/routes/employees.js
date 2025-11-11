const express = require('express');
const employeeController = require('../controllers/employeeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateSchema } = require('../middleware/validation');
const { employeeSchemas, querySchemas } = require('../schemas/validationSchemas');

const router = express.Router();

// All employee routes require authentication
router.use(authenticateToken);

// Get all employees with optional filtering
router.get('/', 
  validateSchema(querySchemas.employeeFilters, 'query'),
  employeeController.getAll
);

// Search employees
router.get('/search', 
  employeeController.search
);

// Get employee statistics
router.get('/stats', 
  employeeController.getStats
);

// Create new employee
router.post('/', 
  validateSchema(employeeSchemas.create),
  employeeController.create
);

// Bulk update employee status
router.put('/bulk/status', 
  employeeController.bulkUpdateStatus
);

// Get single employee by ID
router.get('/:id', 
  employeeController.getById
);

// Get employee by employee ID
router.get('/employee-id/:employeeId', 
  employeeController.getByEmployeeId
);

// Update employee
router.put('/:id', 
  validateSchema(employeeSchemas.update),
  employeeController.update
);

// Delete (deactivate) employee
router.delete('/:id', 
  employeeController.delete
);

module.exports = router;