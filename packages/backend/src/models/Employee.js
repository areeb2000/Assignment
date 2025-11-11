const database = require('../database');

class EmployeeModel {
  static async create(employeeData) {
    const { 
      employee_id, first_name, last_name, email, phone, role, 
      department_id, joining_date, status = 'active', salary, 
      address, emergency_contact, emergency_phone 
    } = employeeData;
    
    return new Promise((resolve, reject) => {
      const stmt = database.getDb().prepare(`
        INSERT INTO employees (
          employee_id, first_name, last_name, email, phone, role,
          department_id, joining_date, status, salary, address,
          emergency_contact, emergency_phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        employee_id, first_name, last_name, email, phone, role,
        department_id, joining_date, status, salary, address,
        emergency_contact, emergency_phone
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, employee_id, first_name, last_name, email, role });
        }
      });
    });
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT e.*, d.name as department_name
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.department_id) {
      query += ' AND e.department_id = ?';
      params.push(filters.department_id);
    }

    if (filters.status) {
      query += ' AND e.status = ?';
      params.push(filters.status);
    }

    if (filters.role) {
      query += ' AND e.role LIKE ?';
      params.push(`%${filters.role}%`);
    }

    if (filters.search) {
      query += ' AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR e.employee_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY e.first_name, e.last_name';

    return new Promise((resolve, reject) => {
      database.getDb().all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      database.getDb().get(`
        SELECT e.*, d.name as department_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE e.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async findByEmployeeId(employeeId) {
    return new Promise((resolve, reject) => {
      database.getDb().get(`
        SELECT e.*, d.name as department_name
        FROM employees e
        LEFT JOIN departments d ON e.department_id = d.id
        WHERE e.employee_id = ?
      `, [employeeId], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, employeeData) {
    const { 
      first_name, last_name, email, phone, role, 
      department_id, status, salary, address, 
      emergency_contact, emergency_phone 
    } = employeeData;
    
    return new Promise((resolve, reject) => {
      database.getDb().run(`
        UPDATE employees 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, role = ?,
            department_id = ?, status = ?, salary = ?, address = ?,
            emergency_contact = ?, emergency_phone = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        first_name, last_name, email, phone, role,
        department_id, status, salary, address,
        emergency_contact, emergency_phone, id
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  static async delete(id) {
    return new Promise((resolve, reject) => {
      database.getDb().run(
        'UPDATE employees SET status = "inactive", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(this.changes);
          }
        }
      );
    });
  }

  static async getStats() {
    return new Promise((resolve, reject) => {
      database.getDb().get(`
        SELECT 
          COUNT(*) as total_employees,
          COUNT(CASE WHEN status = 'active' THEN 1 END) as active_employees,
          COUNT(CASE WHEN status = 'inactive' THEN 1 END) as inactive_employees,
          COUNT(DISTINCT department_id) as departments_with_employees
        FROM employees
      `, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async getDepartmentStats() {
    return new Promise((resolve, reject) => {
      database.getDb().all(`
        SELECT 
          d.name as department,
          COUNT(e.id) as employee_count,
          COUNT(CASE WHEN e.status = 'active' THEN 1 END) as active_count
        FROM departments d
        LEFT JOIN employees e ON d.id = e.department_id
        WHERE d.is_active = 1
        GROUP BY d.id, d.name
        ORDER BY employee_count DESC
      `, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async generateEmployeeId() {
    return new Promise((resolve, reject) => {
      database.getDb().get(
        'SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1',
        [],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            let nextId = 'EMP001';
            if (row && row.employee_id) {
              const currentNum = parseInt(row.employee_id.replace('EMP', ''));
              const nextNum = currentNum + 1;
              nextId = `EMP${nextNum.toString().padStart(3, '0')}`;
            }
            resolve(nextId);
          }
        }
      );
    });
  }
}

module.exports = EmployeeModel;