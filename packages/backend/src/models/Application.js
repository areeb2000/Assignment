const database = require('../database');

class ApplicationModel {
  static async create(applicationData) {
    const { 
      application_id, first_name, last_name, email, phone, 
      job_role_id, experience_years, resume_url, cover_letter, 
      status = 'new', applied_date, interview_date, notes 
    } = applicationData;
    
    return new Promise((resolve, reject) => {
      const stmt = database.getDb().prepare(`
        INSERT INTO applications (
          application_id, first_name, last_name, email, phone,
          job_role_id, experience_years, resume_url, cover_letter,
          status, applied_date, interview_date, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([
        application_id, first_name, last_name, email, phone,
        job_role_id, experience_years, resume_url, cover_letter,
        status, applied_date, interview_date, notes
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, application_id, first_name, last_name, email });
        }
      });
    });
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT a.*, jr.title as job_title, d.name as department_name
      FROM applications a
      LEFT JOIN job_roles jr ON a.job_role_id = jr.id
      LEFT JOIN departments d ON jr.department_id = d.id
      WHERE 1=1
    `;
    const params = [];

    if (filters.job_role_id) {
      query += ' AND a.job_role_id = ?';
      params.push(filters.job_role_id);
    }

    if (filters.status) {
      query += ' AND a.status = ?';
      params.push(filters.status);
    }

    if (filters.department_id) {
      query += ' AND jr.department_id = ?';
      params.push(filters.department_id);
    }

    if (filters.search) {
      query += ' AND (a.first_name LIKE ? OR a.last_name LIKE ? OR a.email LIKE ? OR a.application_id LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    query += ' ORDER BY a.applied_date DESC, a.created_at DESC';

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
        SELECT a.*, jr.title as job_title, jr.description as job_description,
               d.name as department_name
        FROM applications a
        LEFT JOIN job_roles jr ON a.job_role_id = jr.id
        LEFT JOIN departments d ON jr.department_id = d.id
        WHERE a.id = ?
      `, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, applicationData) {
    const { 
      first_name, last_name, email, phone, job_role_id, 
      experience_years, status, interview_date, notes 
    } = applicationData;
    
    return new Promise((resolve, reject) => {
      database.getDb().run(`
        UPDATE applications 
        SET first_name = ?, last_name = ?, email = ?, phone = ?, job_role_id = ?,
            experience_years = ?, status = ?, interview_date = ?, notes = ?,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [
        first_name, last_name, email, phone, job_role_id,
        experience_years, status, interview_date, notes, id
      ], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }

  static async updateStatus(id, status, notes = null) {
    return new Promise((resolve, reject) => {
      database.getDb().run(`
        UPDATE applications 
        SET status = ?, notes = COALESCE(?, notes), updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [status, notes, id], function(err) {
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
        'DELETE FROM applications WHERE id = ?',
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
          COUNT(*) as total_applications,
          COUNT(CASE WHEN status = 'new' THEN 1 END) as new_applications,
          COUNT(CASE WHEN status = 'shortlisted' THEN 1 END) as shortlisted_applications,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_applications,
          COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired_applications
        FROM applications
      `, [], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async getApplicationsByRole() {
    return new Promise((resolve, reject) => {
      database.getDb().all(`
        SELECT 
          jr.title as job_title,
          COUNT(a.id) as application_count,
          COUNT(CASE WHEN a.status = 'new' THEN 1 END) as new_count,
          COUNT(CASE WHEN a.status = 'shortlisted' THEN 1 END) as shortlisted_count,
          COUNT(CASE WHEN a.status = 'rejected' THEN 1 END) as rejected_count
        FROM job_roles jr
        LEFT JOIN applications a ON jr.id = a.job_role_id
        WHERE jr.is_active = 1
        GROUP BY jr.id, jr.title
        ORDER BY application_count DESC
      `, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static async generateApplicationId() {
    return new Promise((resolve, reject) => {
      database.getDb().get(
        'SELECT application_id FROM applications ORDER BY id DESC LIMIT 1',
        [],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            let nextId = 'APP001';
            if (row && row.application_id) {
              const currentNum = parseInt(row.application_id.replace('APP', ''));
              const nextNum = currentNum + 1;
              nextId = `APP${nextNum.toString().padStart(3, '0')}`;
            }
            resolve(nextId);
          }
        }
      );
    });
  }
}

module.exports = ApplicationModel;