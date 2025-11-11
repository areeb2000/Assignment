const express = require('express');
const applicationController = require('../controllers/applicationController');
const { authenticateToken } = require('../middleware/auth');
const { validateSchema } = require('../middleware/validation');
const { applicationSchemas, querySchemas } = require('../schemas/validationSchemas');

const router = express.Router();

// All application routes require authentication
router.use(authenticateToken);

// Get all applications with optional filtering
router.get('/', 
  validateSchema(querySchemas.applicationFilters, 'query'),
  applicationController.getAll
);

// Get applications by job role categories
router.get('/categories', 
  applicationController.getByJobCategories
);

// Search applications
router.get('/search', 
  applicationController.search
);

// Get application statistics
router.get('/stats', 
  applicationController.getStats
);

// Create new application
router.post('/', 
  validateSchema(applicationSchemas.create),
  applicationController.create
);

// Bulk update application status
router.put('/bulk/status', 
  applicationController.bulkUpdateStatus
);

// Get single application by ID
router.get('/:id', 
  applicationController.getById
);

// Update application
router.put('/:id', 
  validateSchema(applicationSchemas.update),
  applicationController.update
);

// Update application status only
router.patch('/:id/status', 
  validateSchema(applicationSchemas.updateStatus),
  applicationController.updateStatus
);

// Delete application
router.delete('/:id', 
  applicationController.delete
);

module.exports = router;