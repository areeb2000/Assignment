const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateSchema } = require('../middleware/validation');
const { authSchemas } = require('../schemas/validationSchemas');

const router = express.Router();

// Public routes
router.post('/register', 
  validateSchema(authSchemas.register), 
  authController.register
);

router.post('/login', 
  validateSchema(authSchemas.login), 
  authController.login
);

// Protected routes
router.get('/profile', 
  authenticateToken, 
  authController.getProfile
);

router.get('/validate', 
  authenticateToken, 
  authController.validateToken
);

// Super Admin only routes
router.get('/users', 
  authenticateToken, 
  authorizeRoles('super_admin'), 
  authController.getAllUsers
);

router.put('/users/role', 
  authenticateToken, 
  authorizeRoles('super_admin'),
  validateSchema(authSchemas.changeRole), 
  authController.changeUserRole
);

module.exports = router;