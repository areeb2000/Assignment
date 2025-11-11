const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// All dashboard routes require authentication
router.use(authenticateToken);

// Dashboard overview
router.get('/overview', dashboardController.getOverview);

// Department statistics
router.get('/departments/stats', dashboardController.getDepartmentStats);

// Application statistics
router.get('/applications/stats', dashboardController.getApplicationStats);

// Recent activities
router.get('/activities', dashboardController.getRecentActivities);

// Filtered dashboard data
router.get('/filtered', dashboardController.getFilteredData);

module.exports = router;