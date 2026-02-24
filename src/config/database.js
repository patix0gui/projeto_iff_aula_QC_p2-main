import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database path
const DB_PATH = join(__dirname, '../../database.sqlite');

/**
 * Database configuration and setup
 */
class DatabaseConfig {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize database connection
   * @returns {Database} SQLite database instance
   */
  connect() {
    if (!this.db) {
      this.db = new Database(DB_PATH, { 
        verbose: console.log 
      });
      
      // Enable foreign keys
      this.db.pragma('foreign_keys = ON');
      
      console.log('✅ Database connected:', DB_PATH);
    }
    return this.db;
  }

  /**
   * Close database connection
   */
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('Database connection closed');
    }
  }

  /**
   * Get database instance
   * @returns {Database} SQLite database instance
   */
  getDB() {
    if (!this.db) {
      this.connect();
    }
    return this.db;
  }
}

// Singleton instance
const dbConfig = new DatabaseConfig();

export default dbConfig;
