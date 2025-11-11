const Joi = require('joi');

const authSchemas = {
  register: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('super_admin', 'hr_user').default('hr_user')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  changeRole: Joi.object({
    userId: Joi.number().integer().positive().required(),
    newRole: Joi.string().valid('super_admin', 'hr_user').required()
  })
};

const employeeSchemas = {
  create: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20),
    role: Joi.string().min(2).max(100).required(),
    department_id: Joi.number().integer().positive().required(),
    joining_date: Joi.date().required(),
    status: Joi.string().valid('active', 'inactive', 'on_leave').default('active'),
    salary: Joi.number().positive().allow(null),
    address: Joi.string().max(500).allow(null, ''),
    emergency_contact: Joi.string().max(100).allow(null, ''),
    emergency_phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).allow(null, '')
  }),

  update: Joi.object({
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).allow(null, ''),
    role: Joi.string().min(2).max(100),
    department_id: Joi.number().integer().positive(),
    status: Joi.string().valid('active', 'inactive', 'on_leave'),
    salary: Joi.number().positive().allow(null),
    address: Joi.string().max(500).allow(null, ''),
    emergency_contact: Joi.string().max(100).allow(null, ''),
    emergency_phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).allow(null, '')
  })
};

const departmentSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).allow(null, ''),
    head_id: Joi.number().integer().positive().allow(null)
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().max(500).allow(null, ''),
    head_id: Joi.number().integer().positive().allow(null)
  })
};

const jobRoleSchemas = {
  create: Joi.object({
    title: Joi.string().min(2).max(100).required(),
    department_id: Joi.number().integer().positive().required(),
    description: Joi.string().max(1000).allow(null, ''),
    requirements: Joi.string().max(1000).allow(null, '')
  }),

  update: Joi.object({
    title: Joi.string().min(2).max(100),
    department_id: Joi.number().integer().positive(),
    description: Joi.string().max(1000).allow(null, ''),
    requirements: Joi.string().max(1000).allow(null, '')
  })
};

const applicationSchemas = {
  create: Joi.object({
    first_name: Joi.string().min(2).max(50).required(),
    last_name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).allow(null, ''),
    job_role_id: Joi.number().integer().positive().required(),
    experience_years: Joi.number().integer().min(0).max(50).default(0),
    resume_url: Joi.string().uri().allow(null, ''),
    cover_letter: Joi.string().max(2000).allow(null, ''),
    applied_date: Joi.date().default(() => new Date()),
    interview_date: Joi.date().allow(null),
    notes: Joi.string().max(1000).allow(null, '')
  }),

  update: Joi.object({
    first_name: Joi.string().min(2).max(50),
    last_name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).allow(null, ''),
    job_role_id: Joi.number().integer().positive(),
    experience_years: Joi.number().integer().min(0).max(50),
    status: Joi.string().valid('new', 'shortlisted', 'rejected', 'hired', 'interview_scheduled'),
    interview_date: Joi.date().allow(null),
    notes: Joi.string().max(1000).allow(null, '')
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('new', 'shortlisted', 'rejected', 'hired', 'interview_scheduled').required(),
    notes: Joi.string().max(1000).allow(null, '')
  })
};

const querySchemas = {
  pagination: Joi.object({
    page: Joi.number().integer().positive().default(1),
    limit: Joi.number().integer().positive().max(100).default(10),
    search: Joi.string().max(100).allow(''),
    sort_by: Joi.string().max(50).allow(''),
    sort_order: Joi.string().valid('asc', 'desc').default('asc')
  }),

  employeeFilters: Joi.object({
    department_id: Joi.number().integer().positive(),
    status: Joi.string().valid('active', 'inactive', 'on_leave'),
    role: Joi.string().max(100)
  }),

  applicationFilters: Joi.object({
    job_role_id: Joi.number().integer().positive(),
    status: Joi.string().valid('new', 'shortlisted', 'rejected', 'hired', 'interview_scheduled'),
    department_id: Joi.number().integer().positive()
  })
};

module.exports = {
  authSchemas,
  employeeSchemas,
  departmentSchemas,
  jobRoleSchemas,
  applicationSchemas,
  querySchemas
};