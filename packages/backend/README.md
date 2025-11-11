# 🚀 Backend API Documentation

## Employee & Recruitment Management System - Backend

This is a comprehensive Node.js backend API for the Employee & Recruitment Management System built with Express.js, SQLite, and JWT authentication.

## 🏗️ Architecture

### Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite with better-sqlite3
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcrypt for password hashing
- **Validation**: Joi for request validation
- **CORS**: Enabled for cross-origin requests

### Project Structure
```
packages/backend/
├── src/
│   ├── controllers/           # Request handlers
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── departmentController.js
│   │   ├── applicationController.js
│   │   ├── dashboardController.js
│   │   └── jobRoleController.js
│   ├── models/                # Database models
│   │   ├── User.js
│   │   ├── Employee.js
│   │   ├── Department.js
│   │   ├── Application.js
│   │   └── JobRole.js
│   ├── routes/                # API route definitions
│   │   ├── auth.js
│   │   ├── employees.js
│   │   ├── departments.js
│   │   ├── applications.js
│   │   ├── dashboard.js
│   │   └── jobRoles.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Global error handling
│   │   └── validation.js      # Request validation
│   ├── schemas/               # Validation schemas
│   │   └── validationSchemas.js
│   ├── scripts/               # Database scripts
│   │   └── seedData.js        # Initial data seeding
│   ├── database.js            # Database configuration
│   └── server.js              # Main server file
├── database/                  # SQLite database files
├── .env.example              # Environment variables template
└── package.json              # Dependencies and scripts
```

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
GET  /api/auth/profile     - Get user profile (protected)
PUT  /api/auth/profile     - Update user profile (protected)
```

### Employee Routes (`/api/employees`)
```
GET    /api/employees      - Get all employees (protected)
POST   /api/employees      - Create employee (protected)
GET    /api/employees/:id  - Get employee by ID (protected)
PUT    /api/employees/:id  - Update employee (protected)
DELETE /api/employees/:id  - Delete employee (protected)
```

### Department Routes (`/api/departments`)
```
GET    /api/departments      - Get all departments (protected)
POST   /api/departments      - Create department (protected)
GET    /api/departments/:id  - Get department by ID (protected)
PUT    /api/departments/:id  - Update department (protected)
DELETE /api/departments/:id  - Delete department (protected)
```

### Application Routes (`/api/applications`)
```
GET    /api/applications      - Get all applications (protected)
POST   /api/applications      - Create application (protected)
GET    /api/applications/:id  - Get application by ID (protected)
PUT    /api/applications/:id  - Update application status (protected)
DELETE /api/applications/:id  - Delete application (protected)
```

### Dashboard Routes (`/api/dashboard`)
```
GET /api/dashboard/stats     - Get dashboard statistics (protected)
GET /api/dashboard/metrics   - Get system metrics (protected)
```

### Job Role Routes (`/api/job-roles`)
```
GET    /api/job-roles      - Get all job roles (protected)
POST   /api/job-roles      - Create job role (protected)
PUT    /api/job-roles/:id  - Update job role (protected)
DELETE /api/job-roles/:id  - Delete job role (protected)
```

## 🔐 Authentication & Security

### JWT Authentication
- JWT tokens issued on login
- Tokens include user ID, email, and role
- Protected routes require valid JWT in Authorization header
- Token format: `Bearer <token>`

### Role-Based Access Control
```
Roles: Admin, HR, Manager, Employee

Admin    - Full access to all resources
HR       - Employee and application management
Manager  - Department and employee viewing
Employee - Limited access to own profile
```

### Password Security
- Passwords hashed using bcrypt with salt rounds
- Minimum password requirements enforced
- Secure password reset functionality

## 📊 Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- email (UNIQUE)
- password (HASHED)
- first_name
- last_name
- role (Admin/HR/Manager/Employee)
- created_at
- updated_at
```

### Employees Table
```sql
- id (PRIMARY KEY)
- user_id (FOREIGN KEY)
- employee_id (UNIQUE)
- department_id (FOREIGN KEY)
- position
- salary
- hire_date
- status (Active/Inactive)
- phone
- address
- created_at
- updated_at
```

### Departments Table
```sql
- id (PRIMARY KEY)
- name (UNIQUE)
- description
- manager_id (FOREIGN KEY)
- budget
- location
- created_at
- updated_at
```

### Applications Table
```sql
- id (PRIMARY KEY)
- job_role_id (FOREIGN KEY)
- applicant_name
- applicant_email
- applicant_phone
- resume_path
- cover_letter
- status (Pending/Approved/Rejected)
- applied_date
- reviewed_by (FOREIGN KEY)
- created_at
- updated_at
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
```bash
cd packages/backend
npm install
```

### Environment Setup
Copy `.env.example` to `.env` and configure:
```env
PORT=3000
JWT_SECRET=your-secret-key-here
DB_PATH=./database/erms.db
NODE_ENV=development
```

### Database Initialization
```bash
npm run seed    # Initialize database with sample data
```

### Running the Server
```bash
npm start       # Production mode
npm run dev     # Development mode with nodemon
```

## 📈 API Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {}
}
```

## 🛡️ Security Features

- **CORS Protection**: Configured for frontend origin
- **Input Validation**: Joi schemas for all requests
- **SQL Injection Prevention**: Parameterized queries
- **Rate Limiting**: Implemented for auth endpoints
- **Helmet.js**: Security headers
- **Data Sanitization**: Input cleaning and validation

## 📝 Logging & Monitoring

- Request/Response logging
- Error tracking and reporting
- Performance monitoring
- Database query logging
- User activity tracking

## 🧪 Testing

### API Testing
Use tools like Postman or Insomnia with the following:
- Base URL: `http://localhost:3000/api`
- Include JWT token in Authorization header for protected routes

### Sample Login Request
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "admin123"
}
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
JWT_SECRET=secure-random-string
DB_PATH=./database/erms.db
```

### Build & Deploy
```bash
npm run build    # Build for production
npm start       # Start production server
```

## 📞 Support

For backend-specific issues:
- Check server logs for detailed error information
- Ensure database is properly initialized
- Verify environment variables are set correctly
- Check JWT token validity for authentication errors

---

**Backend API Version**: 1.0.0  
**Node.js Version**: 16+  
**Database**: SQLite with better-sqlite3  
**Last Updated**: November 2025