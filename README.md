# 📊 Employee & Recruitment Management System (ERMS)

A comprehensive web-based HR management platform built with Angular frontend and Node.js backend, featuring employee management, recruitment tracking, and organizational analytics.

## 🎯 Project Overview

This system enables HR teams to efficiently manage employee records, track job applications, and analyze organizational data through an interactive dashboard. Built with modern technologies and best practices, it provides role-based access control, real-time data visualization, and responsive design.

## 🚀 Features

### 🏠 Dashboard
- **Key Metrics Overview**: Total employees, applicants, departments, and active job roles
- **Data Visualization**: Interactive charts using Chart.js and ng2-charts
- **Real-time Updates**: Dynamic data refresh with filters and search capabilities
- **Department Analytics**: Employee distribution and department statistics

### 👥 Employee Management
- **Complete CRUD Operations**: Add, view, edit, and manage employee records
- **Advanced Filtering**: Filter by department, role, status, and custom searches
- **Employee Profiles**: Comprehensive employee information including personal and professional details
- **Bulk Operations**: Mass status updates and data management
- **Employee ID Generation**: Automatic unique ID assignment

### 💼 Job Applications
- **Role-based Categorization**: Applications sorted by Frontend Developer, Backend Developer, Tester, Business Analyst
- **Status Management**: Track application progress (New, Shortlisted, Rejected, Hired, Interview Scheduled)
- **Application Details**: Complete applicant profiles with experience, contact info, and resume links
- **Bulk Status Updates**: Efficient management of multiple applications

### 🏢 Department Management *(Optional Module)*
- **Department CRUD**: Create, update, and manage organizational departments
- **Employee Distribution**: View employee counts per department
- **Department Heads**: Assign and manage department leadership

### 📄 Document Management *(Optional Module)*
- **File Upload**: Support for resumes, offer letters, ID proofs, and other documents
- **Document Categories**: Organized file management system
- **Preview & Download**: Built-in document viewer with download capabilities
- **Employee Association**: Link documents to specific employees or applications

### 🔐 Authentication & Authorization
- **JWT Token-based Authentication**: Secure login system with token management
- **Role-based Access Control**: 
  - **Super Admin**: Full system access including user management
  - **HR User**: Access to employee and application management modules
- **Route Guards**: Protected routes based on authentication and roles
- **Session Management**: Automatic logout and session timeout handling

### 🧱 Dynamic Components
- **Runtime UI Rendering**: Dynamic popup modals and confirmation dialogs
- **Reusable Widgets**: Configurable dashboard cards, charts, and statistics
- **Dynamic Forms**: Runtime-loaded forms for different data types
- **Component Lifecycle Management**: Efficient memory and performance management

## 🛠️ Tech Stack

### Frontend
- **Framework**: Angular 16+
- **UI Library**: Angular Material UI
- **Styling**: SCSS with Flexbox/Grid layouts
- **Charts**: Chart.js with ng2-charts wrapper
- **HTTP Client**: Angular HttpClient with interceptors
- **State Management**: RxJS Observables and BehaviorSubjects
- **Routing**: Angular Router with lazy loading and guards

### Backend
- **Runtime**: Node.js with Express.js framework
- **Database**: SQLite with SQL queries
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Joi schema validation
- **Security**: Helmet.js, CORS, Rate limiting
- **API Documentation**: RESTful API design
- **File Handling**: Multer for document uploads

### Development Tools
- **Package Manager**: npm with workspaces (monorepo)
- **Code Quality**: TypeScript, ESLint
- **Build Tools**: Angular CLI, Babel
- **Process Management**: Nodemon for development
- **Environment**: dotenv for configuration

## 📁 Project Structure

```
employee-recruitment-management/
├── packages/
│   ├── backend/                 # Node.js Express API
│   │   ├── src/
│   │   │   ├── controllers/     # API route handlers
│   │   │   ├── models/          # Database models (SQLite)
│   │   │   ├── schemas/         # Joi validation schemas
│   │   │   ├── middleware/      # Auth, validation, error handling
│   │   │   ├── routes/          # API endpoints
│   │   │   ├── scripts/         # Database seeding
│   │   │   ├── database.js      # SQLite database setup
│   │   │   └── server.js        # Express server
│   │   ├── .env.example         # Environment configuration
│   │   └── package.json
│   │
│   └── frontend/                # Angular Application
│       ├── src/
│       │   ├── app/
│       │   │   ├── core/        # Singletons (auth, guards, interceptors)
│       │   │   ├── shared/      # Reusable components, pipes, directives
│       │   │   ├── features/    # Feature modules (lazy loaded)
│       │   │   │   ├── auth/    # Authentication module
│       │   │   │   ├── dashboard/ # Dashboard module
│       │   │   │   ├── employees/ # Employee management
│       │   │   │   ├── applications/ # Job applications
│       │   │   │   └── departments/ # Department management
│       │   │   └── app.module.ts
│       │   ├── environments/    # Environment configurations
│       │   └── styles.scss     # Global styles
│       ├── angular.json
│       └── package.json
│
├── package.json                # Root package.json (monorepo)
├── .gitignore
└── README.md
```

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Git**: Latest version

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd employee-recruitment-management
   ```

2. **Install Dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install all package dependencies
   npm run install:all
   ```

3. **Backend Setup**
   ```bash
   # Navigate to backend
   cd packages/backend

   # Copy environment file
   copy .env.example .env

   # Edit .env file with your configurations
   # Set JWT_SECRET, database path, etc.

   # Seed the database with sample data
   npm run seed
   ```

4. **Frontend Setup**
   ```bash
   # Navigate to frontend (in a new terminal)
   cd packages/frontend

   # The Angular app is ready to run
   ```

### Running the Application

#### Development Mode (Both Frontend & Backend)
```bash
# From project root - runs both concurrently
npm run dev
```

#### Individual Services
```bash
# Backend only (http://localhost:3000)
npm run dev:backend

# Frontend only (http://localhost:4200)
npm run dev:frontend
```

### Production Build

```bash
# Build both applications
npm run build

# Start production server
npm run start
```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRES_IN=7d
DB_PATH=./database/erms.sqlite
NODE_ENV=development
UPLOAD_PATH=./uploads
CORS_ORIGIN=http://localhost:4200
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  appName: 'Employee & Recruitment Management System',
  version: '1.0.0'
};
```

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/validate` - Validate JWT token

### Employee Endpoints
- `GET /api/employees` - Get all employees (with filters)
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee
- `GET /api/employees/stats` - Get employee statistics

### Application Endpoints
- `GET /api/applications` - Get all applications (with filters)
- `POST /api/applications` - Create new application
- `GET /api/applications/categories` - Get applications by job categories
- `PUT /api/applications/:id` - Update application
- `PATCH /api/applications/:id/status` - Update application status
- `DELETE /api/applications/:id` - Delete application

### Dashboard Endpoints
- `GET /api/dashboard/overview` - Get dashboard overview data
- `GET /api/dashboard/departments/stats` - Get department statistics
- `GET /api/dashboard/applications/stats` - Get application statistics

## 🔒 Default Login Credentials

After running the seed script, you can use these credentials:

**Super Admin:**
- Email: `admin@company.com`
- Password: `admin123`
- Access: Full system access

**HR User:**
- Email: `hr@company.com`
- Password: `hr123`
- Access: Employee and application management

## 🎨 UI/UX Features

### Design System
- **Material Design**: Consistent with Google's Material Design principles
- **Responsive Layout**: Mobile-first design with breakpoint management
- **Dark Mode Support**: Automatic dark theme detection
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### Interactive Elements
- **Real-time Search**: Instant filtering and search results
- **Dynamic Tables**: Sortable columns with pagination
- **Modal Dialogs**: Context-aware popup forms and confirmations
- **Snackbar Notifications**: User feedback for actions and errors
- **Loading States**: Skeleton loaders and progress indicators

## 🔍 Key Implementation Highlights

### Authentication Flow
1. **JWT Token Management**: Secure token storage and automatic refresh
2. **Route Protection**: Guards prevent unauthorized access
3. **Role-based UI**: Dynamic menu items based on user permissions
4. **Session Handling**: Automatic logout on token expiration

### Data Management
1. **Reactive Patterns**: RxJS for reactive data flow
2. **State Management**: BehaviorSubjects for shared state
3. **Caching Strategy**: Intelligent data caching for performance
4. **Error Handling**: Comprehensive error boundaries and user feedback

### Performance Optimization
1. **Lazy Loading**: Feature modules loaded on demand
2. **OnPush Strategy**: Change detection optimization
3. **Virtual Scrolling**: Efficient rendering of large datasets
4. **Bundle Optimization**: Tree shaking and code splitting

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the Angular app:**
   ```bash
   cd packages/frontend
   npm run build:prod
   ```

2. **Deploy the dist folder** to your preferred hosting platform

### Backend Deployment (Heroku/Railway/DigitalOcean)

1. **Prepare for production:**
   ```bash
   cd packages/backend
   npm run build
   ```

2. **Set environment variables** on your hosting platform
3. **Deploy the application** with the production database

### Environment Variables for Production
```env
NODE_ENV=production
JWT_SECRET=<strong-production-secret>
DB_PATH=/app/database/erms.sqlite
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🧪 Testing

### Backend Tests
```bash
cd packages/backend
npm run test
```

### Frontend Tests
```bash
cd packages/frontend
npm run test
```

### End-to-End Tests
```bash
cd packages/frontend
npm run e2e
```

## 📈 Future Enhancements

### Planned Features
- **Advanced Analytics**: More detailed reporting and insights
- **Email Notifications**: Automated notifications for application updates
- **Calendar Integration**: Interview scheduling with calendar sync
- **Document OCR**: Automatic data extraction from uploaded documents
- **Mobile App**: React Native mobile application
- **Advanced Search**: Full-text search with Elasticsearch
- **Real-time Chat**: Communication system for HR teams
- **Audit Logging**: Complete activity tracking and compliance

### Technical Improvements
- **Microservices**: Break backend into smaller services
- **GraphQL API**: More efficient data fetching
- **Docker**: Containerization for consistent deployments
- **CI/CD Pipeline**: Automated testing and deployment
- **Performance Monitoring**: Application performance insights
- **Progressive Web App**: Offline functionality and push notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Development**: Full-stack implementation with modern best practices
- **Design**: Material Design principles with custom branding
- **Architecture**: Scalable monorepo structure with clear separation of concerns

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Review the documentation
- Check the API endpoints in the code

---

**Built with ❤️ using Angular, Node.js, and modern web technologies**