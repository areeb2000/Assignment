const ApplicationModel = require('../models/Application');
const JobRoleModel = require('../models/JobRole');
const { asyncHandler } = require('../middleware/errorHandler');

const applicationController = {
  // Create new application
  create: asyncHandler(async (req, res) => {
    // Generate application ID
    const application_id = await ApplicationModel.generateApplicationId();
    
    const applicationData = {
      ...req.body,
      application_id,
      applied_date: req.body.applied_date || new Date().toISOString().split('T')[0]
    };

    // Verify job role exists
    const jobRole = await JobRoleModel.findById(applicationData.job_role_id);
    if (!jobRole) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job role specified'
      });
    }

    const application = await ApplicationModel.create(applicationData);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: { application }
    });
  }),

  // Get all applications with filtering
  getAll: asyncHandler(async (req, res) => {
    const { job_role_id, status, department_id, search } = req.query;
    
    const filters = {};
    if (job_role_id) filters.job_role_id = parseInt(job_role_id);
    if (status) filters.status = status;
    if (department_id) filters.department_id = parseInt(department_id);
    if (search) filters.search = search;

    const applications = await ApplicationModel.findAll(filters);
    
    res.json({
      success: true,
      data: {
        applications,
        total: applications.length,
        filters_applied: Object.keys(filters).length > 0
      }
    });
  }),

  // Get applications by job role categories
  getByJobCategories: asyncHandler(async (req, res) => {
    // Define common job role categories
    const categories = {
      'Frontend Developer': [],
      'Backend Developer': [],
      'Tester': [],
      'Business Analyst': [],
      'Other': []
    };

    const allApplications = await ApplicationModel.findAll();
    
    // Categorize applications based on job title
    allApplications.forEach(app => {
      const jobTitle = app.job_title || '';
      let categorized = false;
      
      for (const category of Object.keys(categories)) {
        if (category !== 'Other' && jobTitle.toLowerCase().includes(category.toLowerCase())) {
          categories[category].push(app);
          categorized = true;
          break;
        }
      }
      
      if (!categorized) {
        categories['Other'].push(app);
      }
    });

    res.json({
      success: true,
      data: {
        categories,
        total_applications: allApplications.length,
        category_counts: Object.keys(categories).reduce((acc, key) => {
          acc[key] = categories[key].length;
          return acc;
        }, {})
      }
    });
  }),

  // Get single application by ID
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const application = await ApplicationModel.findById(id);
    
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      data: { application }
    });
  }),

  // Update application
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if application exists
    const existingApplication = await ApplicationModel.findById(id);
    if (!existingApplication) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // If job_role_id is being updated, verify it exists
    if (req.body.job_role_id) {
      const jobRole = await JobRoleModel.findById(req.body.job_role_id);
      if (!jobRole) {
        return res.status(400).json({
          success: false,
          message: 'Invalid job role specified'
        });
      }
    }

    const updated = await ApplicationModel.update(id, req.body);
    
    if (updated === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to application'
      });
    }

    // Get updated application data
    const updatedApplication = await ApplicationModel.findById(id);
    
    res.json({
      success: true,
      message: 'Application updated successfully',
      data: { application: updatedApplication }
    });
  }),

  // Update application status
  updateStatus: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    // Check if application exists
    const application = await ApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const updated = await ApplicationModel.updateStatus(id, status, notes);
    
    if (updated === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update application status'
      });
    }

    // Get updated application
    const updatedApplication = await ApplicationModel.findById(id);
    
    res.json({
      success: true,
      message: 'Application status updated successfully',
      data: { application: updatedApplication }
    });
  }),

  // Delete application
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if application exists
    const application = await ApplicationModel.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    const deleted = await ApplicationModel.delete(id);
    
    if (deleted === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete application'
      });
    }

    res.json({
      success: true,
      message: 'Application deleted successfully'
    });
  }),

  // Get application statistics
  getStats: asyncHandler(async (req, res) => {
    const [overallStats, roleStats] = await Promise.all([
      ApplicationModel.getStats(),
      ApplicationModel.getApplicationsByRole()
    ]);

    res.json({
      success: true,
      data: {
        overall: overallStats,
        by_role: roleStats
      }
    });
  }),

  // Search applications
  search: asyncHandler(async (req, res) => {
    const { q: query, job_role_id, status, department_id } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filters = { search: query.trim() };
    if (job_role_id) filters.job_role_id = parseInt(job_role_id);
    if (status) filters.status = status;
    if (department_id) filters.department_id = parseInt(department_id);

    const applications = await ApplicationModel.findAll(filters);
    
    res.json({
      success: true,
      data: {
        applications,
        total: applications.length,
        query: query.trim()
      }
    });
  }),

  // Bulk update application status
  bulkUpdateStatus: asyncHandler(async (req, res) => {
    const { application_ids, status, notes } = req.body;
    
    if (!Array.isArray(application_ids) || application_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Application IDs array is required'
      });
    }

    const validStatuses = ['new', 'shortlisted', 'rejected', 'hired', 'interview_scheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Update each application
    const updatePromises = application_ids.map(id => 
      ApplicationModel.updateStatus(id, status, notes)
    );

    const results = await Promise.allSettled(updatePromises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.length - successful;

    res.json({
      success: true,
      message: `Bulk status update completed. ${successful} updated, ${failed} failed.`,
      data: {
        total_requested: application_ids.length,
        successful_updates: successful,
        failed_updates: failed
      }
    });
  })
};

module.exports = applicationController;