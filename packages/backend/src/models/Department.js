const database = require('../database');

class DepartmentModel {
  static async create(departmentData) {
    const { name, description, head_id } = departmentData;
    
    return new Promise((resolve, reject) => {
      const stmt = database.getDb().prepare(`
        INSERT INTO departments (name, description, head_id)
        VALUES (?, ?, ?)
      `);
      
      stmt.run([name, description, head_id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, name, description, head_id });
        }
      });
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      database.getDb().all(`
        SELECT d.*, 
               e.first_name || ' ' || e.last_name as head_name,
               COUNT(emp.id) as employee_count
        FROM departments d
        LEFT JOIN employees e ON d.head_id = e.id
        LEFT JOIN employees emp ON d.id = emp.department_id AND emp.status = 'active'
        WHERE d.is_active = 1
        GROUP BY d.id
        ORDER BY d.name
      `, [], (err, rows) => {
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
        SELECT d.*, 
               e.first_name || ' ' || e.last_name as head_name,
               COUNT(emp.id) as employee_count
        FROM departments d
        LEFT JOIN employees e ON d.head_id = e.id
        LEFT JOIN employees emp ON d.id = emp.department_id AND emp.status = 'active'
        WHERE d.id = ? AND d.is_active = 1
        GROUP BY d.id
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, departmentData) {
    const { name, description, head_id } = departmentData;
    
    return new Promise((resolve, reject) => {
      database.getDb().run(`
        UPDATE departments 
        SET name = ?, description = ?, head_id = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, description, head_id, id], function(err) {
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
        'UPDATE departments SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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
          COUNT(*) as total_departments,
          COUNT(CASE WHEN head_id IS NOT NULL THEN 1 END) as departments_with_head
        FROM departments 
        WHERE is_active = 1
      `, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }
}

module.exports = DepartmentModel;