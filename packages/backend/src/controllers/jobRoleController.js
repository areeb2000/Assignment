const JobRoleModel = require('../models/JobRole');
const { asyncHandler } = require('../middleware/errorHandler');

const jobRoleController = {
  // Get all job roles
  getAll: asyncHandler(async (req, res) => {
    const { department_id } = req.query;
    
    const filters = {};
    if (department_id) filters.department_id = parseInt(department_id);

    const jobRoles = await JobRoleModel.findAll(filters);
    
    res.json({
      success: true,
      data: {
        job_roles: jobRoles,
        total: jobRoles.length
      }
    });
  }),

  // Get single job role by ID
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const jobRole = await JobRoleModel.findById(id);
    
    if (!jobRole) {
      return res.status(404).json({
        success: false,
        message: 'Job role not found'
      });
    }

    res.json({
      success: true,
      data: { job_role: jobRole }
    });
  }),

  // Create new job role
  create: asyncHandler(async (req, res) => {
    const jobRole = await JobRoleModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Job role created successfully',
      data: { job_role: jobRole }
    });
  }),

  // Update job role
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if job role exists
    const existingJobRole = await JobRoleModel.findById(id);
    if (!existingJobRole) {
      return res.status(404).json({
        success: false,
        message: 'Job role not found'
      });
    }

    const updated = await JobRoleModel.update(id, req.body);
    
    if (updated === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to job role'
      });
    }

    const updatedJobRole = await JobRoleModel.findById(id);
    
    res.json({
      success: true,
      message: 'Job role updated successfully',
      data: { job_role: updatedJobRole }
    });
  }),

  // Delete job role
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if job role exists
    const existingJobRole = await JobRoleModel.findById(id);
    if (!existingJobRole) {
      return res.status(404).json({
        success: false,
        message: 'Job role not found'
      });
    }

    // Check if job role is being used by any applications
    // This would be implemented based on business logic
    
    const deleted = await JobRoleModel.delete(id);
    
    if (deleted === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete job role'
      });
    }

    res.json({
      success: true,
      message: 'Job role deleted successfully'
    });
  })
};

module.exports = jobRoleController;