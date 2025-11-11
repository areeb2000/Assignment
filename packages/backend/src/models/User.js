const database = require('../database');
const bcrypt = require('bcryptjs');

class UserModel {
  static async create(userData) {
    const { username, email, password, role = 'hr_user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 12);
    
    return new Promise((resolve, reject) => {
      const stmt = database.getDb().prepare(`
        INSERT INTO users (username, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `);
      
      stmt.run([username, email, hashedPassword, role], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, username, email, role });
        }
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      database.getDb().get(
        'SELECT * FROM users WHERE email = ? AND is_active = 1',
        [email],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      database.getDb().get(
        'SELECT id, username, email, role, is_active, created_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      database.getDb().all(
        'SELECT id, username, email, role, is_active, created_at FROM users WHERE is_active = 1',
        [],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async updateRole(userId, newRole) {
    return new Promise((resolve, reject) => {
      database.getDb().run(
        'UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [newRole, userId],
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

module.exports = UserModel;