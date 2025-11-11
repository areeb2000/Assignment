const DepartmentModel = require('../models/Department');
const { asyncHandler } = require('../middleware/errorHandler');

const departmentController = {
  // Create new department
  create: asyncHandler(async (req, res) => {
    const department = await DepartmentModel.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { department }
    });
  }),

  // Get all departments
  getAll: asyncHandler(async (req, res) => {
    const departments = await DepartmentModel.findAll();
    
    res.json({
      success: true,
      data: {
        departments,
        total: departments.length
      }
    });
  }),

  // Get single department by ID
  getById: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const department = await DepartmentModel.findById(id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: { department }
    });
  }),

  // Update department
  update: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if department exists
    const existingDepartment = await DepartmentModel.findById(id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const department = await DepartmentModel.update(id, req.body);
    
    res.json({
      success: true,
      message: 'Department updated successfully',
      data: { department }
    });
  }),

  // Delete department
  delete: asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Check if department exists
    const existingDepartment = await DepartmentModel.findById(id);
    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has employees
    const employeeCount = await DepartmentModel.getEmployeeCount(id);
    if (employeeCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete department. It has ${employeeCount} employee(s) assigned.`
      });
    }

    await DepartmentModel.delete(id);
    
    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  }),

  // Get department statistics
  getStats: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const stats = await DepartmentModel.getStats(id);
    
    res.json({
      success: true,
      data: { stats }
    });
  })
};

module.exports = departmentController;