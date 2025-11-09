const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  // Создание пользователя
  static async create(userData) {
    const { email, password, role = 'user' } = userData;
    
    // Хеширование пароля
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)`;
      db.run(sql, [email, password_hash, role], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  // Поиск пользователя по email
  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE email = ?`;
      db.get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Поиск пользователя по ID
  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM users WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Проверка пароля
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Обновление данных пользователя
  static update(id, updateData) {
    const { email, role } = updateData;
    const sql = `UPDATE users SET email = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    
    return new Promise((resolve, reject) => {
      db.run(sql, [email, role, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.changes);
        }
      });
    });
  }
}

module.exports = User;