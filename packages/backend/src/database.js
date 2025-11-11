const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    const dbDir = path.dirname(process.env.DB_PATH || './database/erms.sqlite');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.db = new sqlite3.Database(process.env.DB_PATH || './database/erms.sqlite');
    this.init();
  }

  init() {
    this.db.serialize(() => {
      // Users table for authentication
      this.db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          role VARCHAR(20) DEFAULT 'hr_user',
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Departments table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS departments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          head_id INTEGER,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (head_id) REFERENCES employees (id)
        )
      `);

      // Employees table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          employee_id VARCHAR(20) UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          phone VARCHAR(20),
          role VARCHAR(100) NOT NULL,
          department_id INTEGER NOT NULL,
          joining_date DATE NOT NULL,
          status VARCHAR(20) DEFAULT 'active',
          salary DECIMAL(10,2),
          address TEXT,
          emergency_contact VARCHAR(100),
          emergency_phone VARCHAR(20),
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (department_id) REFERENCES departments (id)
        )
      `);

      // Job roles table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS job_roles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title VARCHAR(100) NOT NULL,
          department_id INTEGER NOT NULL,
          description TEXT,
          requirements TEXT,
          is_active BOOLEAN DEFAULT 1,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (department_id) REFERENCES departments (id)
        )
      `);

      // Job applications table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          application_id VARCHAR(20) UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          email VARCHAR(100) NOT NULL,
          phone VARCHAR(20),
          job_role_id INTEGER NOT NULL,
          experience_years INTEGER DEFAULT 0,
          resume_url VARCHAR(255),
          cover_letter TEXT,
          status VARCHAR(20) DEFAULT 'new',
          applied_date DATE DEFAULT CURRENT_DATE,
          interview_date DATETIME,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (job_role_id) REFERENCES job_roles (id)
        )
      `);

      // Documents table
      this.db.run(`
        CREATE TABLE IF NOT EXISTS documents (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          employee_id INTEGER,
          application_id INTEGER,
          document_type VARCHAR(50) NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_size INTEGER,
          mime_type VARCHAR(100),
          upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
          uploaded_by INTEGER,
          is_active BOOLEAN DEFAULT 1,
          FOREIGN KEY (employee_id) REFERENCES employees (id),
          FOREIGN KEY (application_id) REFERENCES applications (id),
          FOREIGN KEY (uploaded_by) REFERENCES users (id)
        )
      `);

      console.log('✅ Database tables initialized successfully');
    });
  }

  getDb() {
    return this.db;
  }

  close() {
    this.db.close();
  }
}

module.exports = new Database();