const database = require('../database');

class JobRoleModel {
  static async create(roleData) {
    const { title, department_id, description, requirements } = roleData;
    
    return new Promise((resolve, reject) => {
      const stmt = database.getDb().prepare(`
        INSERT INTO job_roles (title, department_id, description, requirements)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([title, department_id, description, requirements], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, title, department_id, description, requirements });
        }
      });
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      database.getDb().all(`
        SELECT jr.*, d.name as department_name,
               COUNT(a.id) as application_count
        FROM job_roles jr
        LEFT JOIN departments d ON jr.department_id = d.id
        LEFT JOIN applications a ON jr.id = a.job_role_id
        WHERE jr.is_active = 1
        GROUP BY jr.id
        ORDER BY jr.title
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
        SELECT jr.*, d.name as department_name
        FROM job_roles jr
        LEFT JOIN departments d ON jr.department_id = d.id
        WHERE jr.id = ? AND jr.is_active = 1
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, roleData) {
    const { title, department_id, description, requirements } = roleData;
    
    return new Promise((resolve, reject) => {
      database.getDb().run(`
        UPDATE job_roles 
        SET title = ?, department_id = ?, description = ?, requirements = ?, 
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [title, department_id, description, requirements, id], function(err) {
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
        'UPDATE job_roles SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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
}

module.exports = JobRoleModel;