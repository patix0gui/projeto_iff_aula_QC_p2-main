import dbConfig from '../config/database.js';

/**
 * UserData - Repository pattern for user data access
 * Uses SQLite database with better-sqlite3
 */
class UserData {
  constructor() {
    this.db = dbConfig.getDB();
  }

  /**
   * Get all users
   * @returns {Array} List of all users
   */
  getAll() {
    try {
      const stmt = this.db.prepare('SELECT * FROM users ORDER BY id ASC');
      return stmt.all();
    } catch (error) {
      console.error('[UserData.getAll] Error:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Object|undefined} User found or undefined
   */
  getById(id) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
      return stmt.get(id);
    } catch (error) {
      console.error('[UserData.getById] Error:', error);
      throw error;
    }
  }

  /**
   * Create new user
   * @param {Object} userData - User data
   * @returns {Object} Created user
   */
  create(userData) {
    try {
      const { name, email, age } = userData;
      
      const stmt = this.db.prepare(`
        INSERT INTO users (name, email, age) 
        VALUES (?, ?, ?)
      `);
      
      const result = stmt.run(name, email, age);
      
      // Return the created user
      return this.getById(result.lastInsertRowid);
    } catch (error) {
      // Handle unique constraint violation (duplicate email)
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const customError = new Error('Email already exists');
        customError.statusCode = 400;
        throw customError;
      }
      console.error('[UserData.create] Error:', error);
      throw error;
    }
  }

  /**
   * Update existing user
   * @param {number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Object} Updated user
   */
  update(id, userData) {
    try {
      const { name, email, age } = userData;
      
      const stmt = this.db.prepare(`
        UPDATE users 
        SET name = COALESCE(?, name),
            email = COALESCE(?, email),
            age = COALESCE(?, age),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      const result = stmt.run(name, email, age, id);
      
      if (result.changes === 0) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      return this.getById(id);
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const customError = new Error('Email already exists');
        customError.statusCode = 400;
        throw customError;
      }
      console.error('[UserData.update] Error:', error);
      throw error;
    }
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {boolean} true if deleted successfully
   */
  delete(id) {
    try {
      const stmt = this.db.prepare('DELETE FROM users WHERE id = ?');
      const result = stmt.run(id);
      
      if (result.changes === 0) {
        const error = new Error('User not found');
        error.statusCode = 404;
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('[UserData.delete] Error:', error);
      throw error;
    }
  }

  /**
   * Get total count of users
   * @returns {number} Total number of users
   */
  count() {
    try {
      const stmt = this.db.prepare('SELECT COUNT(*) as count FROM users');
      const result = stmt.get();
      return result.count;
    } catch (error) {
      console.error('[UserData.count] Error:', error);
      throw error;
    }
  }

  /**
   * Find users by email
   * @param {string} email - Email to search
   * @returns {Object|undefined} User found
   */
  findByEmail(email) {
    try {
      const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
      return stmt.get(email);
    } catch (error) {
      console.error('[UserData.findByEmail] Error:', error);
      throw error;
    }
  }

  /**
   * Search users by name (partial match)
   * @param {string} searchTerm - Search term
   * @returns {Array} List of matching users
   */
  searchByName(searchTerm) {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM users 
        WHERE name LIKE ? 
        ORDER BY name ASC
      `);
      return stmt.all(`%${searchTerm}%`);
    } catch (error) {
      console.error('[UserData.searchByName] Error:', error);
      throw error;
    }
  }
}

// Export singleton instance
const userDataInstance = new UserData();
export default userDataInstance;
