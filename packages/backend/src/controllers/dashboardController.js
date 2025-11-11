const EmployeeModel = require('../models/Employee');
const DepartmentModel = require('../models/Department');
const ApplicationModel = require('../models/Application');
const { asyncHandler } = require('../middleware/errorHandler');

const dashboardController = {
  // Get dashboard overview data
  getOverview: asyncHandler(async (req, res) => {
    try {
      // Get all statistics in parallel
      const [
        employeeStats,
        applicationStats,
        departmentStats,
        departmentEmployeeStats,
        applicationsByRole
      ] = await Promise.all([
        EmployeeModel.getStats(),
        ApplicationModel.getStats(),
        DepartmentModel.getStats(),
        EmployeeModel.getDepartmentStats(),
        ApplicationModel.getApplicationsByRole()
      ]);

      const overview = {
        summary: {
          total_employees: employeeStats.total_employees || 0,
          active_employees: employeeStats.active_employees || 0,
          total_applicants: applicationStats.total_applications || 0,
          total_departments: departmentStats.total_departments || 0,
          new_applications: applicationStats.new_applications || 0,
          shortlisted_applications: applicationStats.shortlisted_applications || 0
        },
        charts: {
          employee_by_department: departmentEmployeeStats || [],
          applications_by_role: applicationsByRole || [],
          application_status_breakdown: {
            new: applicationStats.new_applications || 0,
            shortlisted: applicationStats.shortlisted_applications || 0,
            rejected: applicationStats.rejected_applications || 0,
            hired: applicationStats.hired_applications || 0
          }
        },
        recent_activities: [] // This could be implemented with an activity log table
      };

      res.json({
        success: true,
        data: overview
      });
    } catch (error) {
      console.error('Dashboard overview error:', error);
      throw error;
    }
  }),

  // Get department-wise statistics
  getDepartmentStats: asyncHandler(async (req, res) => {
    const stats = await EmployeeModel.getDepartmentStats();
    
    res.json({
      success: true,
      data: {
        department_stats: stats
      }
    });
  }),

  // Get application statistics
  getApplicationStats: asyncHandler(async (req, res) => {
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

  // Get recent activities (placeholder for future implementation)
  getRecentActivities: asyncHandler(async (req, res) => {
    // This would require an activity log table to track actions
    const activities = [
      {
        id: 1,
        type: 'employee_added',
        description: 'New employee John Doe added to Engineering department',
        timestamp: new Date(),
        user: req.user.username
      },
      {
        id: 2,
        type: 'application_updated',
        description: 'Application status updated to shortlisted',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        user: req.user.username
      }
    ];

    res.json({
      success: true,
      data: {
        activities
      }
    });
  }),

  // Get filtered dashboard data
  getFilteredData: asyncHandler(async (req, res) => {
    const { department_id, date_from, date_to, role } = req.query;
    
    // Build filters object
    const filters = {};
    if (department_id) filters.department_id = department_id;
    if (role) filters.role = role;

    // Get filtered employees and applications
    const [employees, applications] = await Promise.all([
      EmployeeModel.findAll(filters),
      ApplicationModel.findAll(filters)
    ]);

    res.json({
      success: true,
      data: {
        employees: employees.length,
        applications: applications.length,
        employee_list: employees.slice(0, 10), // Latest 10 employees
        application_list: applications.slice(0, 10) // Latest 10 applications
      }
    });
  })
};

module.exports = dashboardController;