const EmployeeModel = require('../models/Employee');
const { asyncHandler } = require('../middleware/errorHandler');

const employeeController = {
  // Create new employee
  create: asyncHandler(async (req, res) => {
    // Generate employee ID
    const employee_id = await EmployeeModel.generateEmployeeId();
    
    const employeeData = {
      ...req.body,
      employee_id
    };

    const employee = await EmployeeModel.create(employeeData);
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: { employee }
    });
  }),

  // Get all employees with filtering
  getAll: asyncHandler(async (req, res) => {
    const { department_id, status, role, search } = req.query;
    
    const filters = {};
    if (department_id) filters.department_id = parseInt(department_id);
    if (status) filters.status = status;
    if (role) filters.role = role;
    if (search) filters.search = search;

    const employees = await EmployeeModel.findAll(filters);
    
    res.json({
      success: true,
      data: {
        employees,
        total: employees.length,
        filters_applied: Object.keys(filters).length > 0
      }
    });
  }),

  // Get single employee by ID
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const employee = await EmployeeModel.findById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: { employee }
    });
  }),

  // Get employee by employee ID
  getByEmployeeId: asyncHandler(async (req, res) => {
    const { employeeId } = req.params;
    const employee = await EmployeeModel.findByEmployeeId(employeeId);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.json({
      success: true,
      data: { employee }
    });
  }),

  // Update employee
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if employee exists
    const existingEmployee = await EmployeeModel.findById(id);
    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const updated = await EmployeeModel.update(id, req.body);
    
    if (updated === 0) {
      return res.status(400).json({
        success: false,
        message: 'No changes made to employee record'
      });
    }

    // Get updated employee data
    const updatedEmployee = await EmployeeModel.findById(id);
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: { employee: updatedEmployee }
    });
  }),

  // Soft delete employee (set status to inactive)
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if employee exists
    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const deleted = await EmployeeModel.delete(id);
    
    if (deleted === 0) {
      return res.status(400).json({
        success: false,
        message: 'Failed to delete employee'
      });
    }

    res.json({
      success: true,
      message: 'Employee deactivated successfully'
    });
  }),

  // Get employee statistics
  getStats: asyncHandler(async (req, res) => {
    const [overallStats, departmentStats] = await Promise.all([
      EmployeeModel.getStats(),
      EmployeeModel.getDepartmentStats()
    ]);

    res.json({
      success: true,
      data: {
        overall: overallStats,
        by_department: departmentStats
      }
    });
  }),

  // Search employees
  search: asyncHandler(async (req, res) => {
    const { q: query, department_id, role, status } = req.query;
    
    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters long'
      });
    }

    const filters = { search: query.trim() };
    if (department_id) filters.department_id = parseInt(department_id);
    if (role) filters.role = role;
    if (status) filters.status = status;

    const employees = await EmployeeModel.findAll(filters);
    
    res.json({
      success: true,
      data: {
        employees,
        total: employees.length,
        query: query.trim()
      }
    });
  }),

  // Bulk update employee status
  bulkUpdateStatus: asyncHandler(async (req, res) => {
    const { employee_ids, status } = req.body;
    
    if (!Array.isArray(employee_ids) || employee_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Employee IDs array is required'
      });
    }

    const validStatuses = ['active', 'inactive', 'on_leave'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    // Update each employee
    const updatePromises = employee_ids.map(id => 
      EmployeeModel.update(id, { status })
    );

    const results = await Promise.allSettled(updatePromises);
    const successful = results.filter(result => result.status === 'fulfilled').length;
    const failed = results.length - successful;

    res.json({
      success: true,
      message: `Bulk update completed. ${successful} updated, ${failed} failed.`,
      data: {
        total_requested: employee_ids.length,
        successful_updates: successful,
        failed_updates: failed
      }
    });
  })
};

module.exports = employeeController;