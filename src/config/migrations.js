import dbConfig from '../config/database.js';

/**
 * Create database tables
 */
export function createTables() {
  const db = dbConfig.getDB();

  // Create users table
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      age INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;

  try {
    db.exec(createUsersTable);
    console.log('✅ Table "users" created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

/**
 * Drop all tables (use with caution!)
 */
export function dropTables() {
  const db = dbConfig.getDB();
  
  try {
    db.exec('DROP TABLE IF EXISTS users');
    console.log('✅ Tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
    throw error;
  }
}

/**
 * Seed initial data
 */
export function seedData() {
  const db = dbConfig.getDB();

  const users = [
    { name: 'João Silva', email: 'joao.silva@email.com', age: 28 },
    { name: 'Maria Santos', email: 'maria.santos@email.com', age: 32 },
    { name: 'Pedro Oliveira', email: 'pedro.oliveira@email.com', age: 25 },
    { name: 'Ana Costa', email: 'ana.costa@email.com', age: 30 },
    { name: 'Carlos Souza', email: 'carlos.souza@email.com', age: 45 }
  ];

  // Check if users already exist
  const count = db.prepare('SELECT COUNT(*) as count FROM users').get();
  
  if (count.count > 0) {
    console.log('ℹ️  Database already contains users. Skipping seed.');
    return;
  }

  const insert = db.prepare(`
    INSERT INTO users (name, email, age) 
    VALUES (@name, @email, @age)
  `);

  const insertMany = db.transaction((users) => {
    for (const user of users) {
      insert.run(user);
    }
  });

  try {
    insertMany(users);
    console.log(`✅ Seeded ${users.length} users successfully`);
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

/**
 * Initialize database with tables and seed data
 */
export function initializeDatabase() {
  console.log('🔧 Initializing database...');
  
  createTables();
  seedData();
  
  console.log('✅ Database initialization complete!');
}

/**
 * Reset database (drop and recreate)
 */
export function resetDatabase() {
  console.log('⚠️  Resetting database...');
  
  dropTables();
  createTables();
  seedData();
  
  console.log('✅ Database reset complete!');
}
